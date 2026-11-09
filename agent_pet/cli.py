import argparse
import json
import math
import os
import re
import sys
import time
from datetime import datetime
from pathlib import Path

from .installer import check, setup, write_settings_atomically


def valid_character(item, filename):
    if not isinstance(item, dict) or not isinstance(item.get("id"), str):
        return False
    if not re.fullmatch(r"[a-z][a-z0-9_-]*", item["id"]) or item["id"] != filename:
        return False
    if not isinstance(item.get("name"), dict) or type(item.get("frames")) is not int or not 1 <= item["frames"] <= 4:
        return False
    face = item.get("face")
    if not isinstance(face, str) or len(face) != 1 or face not in "OECBFAZX":
        return False
    base = item.get("base")
    if not isinstance(base, list) or len(base) != 16 or any(
            not isinstance(row, str) or not re.fullmatch(r"[.OECBFAZX]{16}", row) for row in base):
        return False

    def points(value):
        return isinstance(value, list) and len(value) == 2 and all(
            isinstance(point, list) and len(point) == 2 and all(
                type(n) is int and 0 <= n < 16 for n in point) for point in value)

    if not all(points(item.get(key)) for key in ("eyes", "mouth", "work")):
        return False

    def when(value):
        if not isinstance(value, dict):
            return False
        for key, rule in value.items():
            if key == "state" and isinstance(rule, str):
                continue
            if key in ("frame", "phase") and type(rule) is int and 0 <= rule < item["frames"]:
                continue
            if key == "awake" and type(rule) is bool:
                continue
            return False
        return True

    overlays = item.get("overlays")
    if not isinstance(overlays, list) or any(
            not isinstance(overlay, dict) or not when(overlay.get("when")) or
            not isinstance(overlay.get("rows"), dict) or any(
                not str(y).isdigit() or str(int(y)) != str(y) or not 0 <= int(y) < 16 or
                not isinstance(row, str) or not re.fullmatch(r"[.OECBFAZX]{16}", row)
                for y, row in overlay["rows"].items()) for overlay in overlays):
        return False
    detail = item.get("detail")
    if not isinstance(detail, list) or any(
            not isinstance(entry, dict) or not when(entry.get("when")) or
            not isinstance(entry.get("lines"), list) or any(
                not isinstance(line, list) or len(line) != 3 or type(line[0]) is not int or
                type(line[1]) is not int or not 0 <= line[0] < 32 or not 0 <= line[1] < 32 or
                not isinstance(line[2], str) or not re.fullmatch(r"[.OECBFAZXHSGD]+", line[2]) or
                line[0] + len(line[2]) > 32 for line in entry["lines"]) for entry in detail):
        return False
    return True


def characters():
    builtins = Path(__file__).resolve().parents[1] / "characters"
    user = config_path().parent / "characters"
    result = []
    for directory in (builtins, user):
        for path in sorted(directory.glob("*.json")):
            try:
                item = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, ValueError, UnicodeError):
                continue
            if not valid_character(item, path.stem):
                continue
            if path.stem not in result:
                result.append(path.stem)
    return result


def config_path():
    return Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "agent-pet" / "config.json"


def state_home():
    return Path(os.environ.get("XDG_STATE_HOME") or Path.home() / ".local" / "state")


def read_object(path):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {}
    if not isinstance(data, dict):
        raise ValueError(f"{path}: esperado um objeto JSON")
    return data


def write_object(path, data):
    write_settings_atomically(path, (json.dumps(data, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def focus_info(focus, now):
    if not number(focus.get("started_at")):
        return None
    work, rest, rounds = focus.get("work_min"), focus.get("break_min"), focus.get("rounds")
    if not all(number(v) for v in (work, rest, rounds)) or work <= 0 or rest < 0 or rounds < 1 or int(rounds) != rounds:
        return None
    work, rest = work * 60000, rest * 60000
    paused = number(focus.get("paused_at"))
    elapsed = max(0, (focus["paused_at"] if paused else now) - focus["started_at"])
    base = {"rounds": rounds, "paused": paused}
    if elapsed >= rounds * work + (rounds - 1) * rest:
        return dict(base, phase="done", round=rounds, remainingMs=0, share=1)
    cycle = work + rest
    index = math.floor(elapsed / cycle)
    within = elapsed - index * cycle
    working = within < work
    return dict(base, phase="work" if working else "break", round=index + 1,
                remainingMs=work - within if working else cycle - within,
                share=within / work if working else (within - work) / rest)


def records(directory):
    for path in sorted(directory.glob("*.json")):
        try:
            data = read_object(path)
        except (OSError, ValueError):
            continue
        if data:
            yield data


def status_data():
    config = read_object(config_path())
    hidden = config.get("hidden_agents")
    hidden = hidden if isinstance(hidden, list) else []
    state = state_home() / "agent-pet"
    sessions = [s for s in records(state / "sessions")
                if isinstance(s.get("session_id"), str) and s.get("status") in ("idle", "working", "attention")
                and s.get("agent", "claude") not in hidden]
    sessions.sort(key=lambda s: (s["status"] != "attention", -(s.get("updated_at") if number(s.get("updated_at")) else 0)))
    usage = [r for r in records(state_home() / "omarchy" / "agents" / "usage")
             if isinstance(r.get("id"), str) and r["id"] not in hidden]
    character = config.get("character")
    return {"character": character if character in characters() else "computer", "sessions": sessions,
            "focus": focus_info(read_object(state / "focus.json"), int(time.time() * 1000)), "usage": usage}


def plain(value):
    return "".join(c if c.isprintable() else " " for c in str(value))


def focus_text(info):
    if not info:
        return "Foco: inativo"
    if info["phase"] == "done":
        return "Foco: concluído"
    seconds = math.ceil(info["remainingMs"] / 1000)
    label = "trabalho" if info["phase"] == "work" else "pausa"
    paused = " · pausado" if info["paused"] else ""
    return f"Foco: {label} · rodada {info['round']}/{info['rounds']} · {seconds // 60}:{seconds % 60:02d}{paused}"


def show_status(data):
    print(f"Personagem: {data['character']}")
    print(focus_text(data["focus"]))
    labels = {"idle": "ocioso", "working": "trabalhando", "attention": "precisa de você"}
    if not data["sessions"]:
        print("Nenhuma sessão visível.")
    for session in data["sessions"]:
        project = session.get("session_title") or Path(str(session.get("cwd") or "")).name or session["session_id"]
        agent = session.get("agent", "claude")
        print(f"- {plain(agent)} · {plain(project)} · {labels[session['status']]}")
    for record in data["usage"]:
        limits = record.get("limits")
        for limit in limits if isinstance(limits, list) else []:
            if isinstance(limit, dict) and number(limit.get("percent")):
                percent = math.floor(max(0, min(1, limit["percent"])) * 100 + 0.5)
                if limit.get("resetsAt"):
                    try:
                        reset = datetime.fromisoformat(str(limit["resetsAt"]).replace("Z", "+00:00"))
                    except ValueError:
                        reset = None
                    if reset and reset.timestamp() <= time.time():
                        percent = 0
                print(f"Limite: {plain(record['id'])} · {plain(limit.get('label', ''))} · {percent}%")


def control_focus(values, parser):
    path = state_home() / "agent-pet" / "focus.json"
    if not values or values == ["status"]:
        print(focus_text(focus_info(read_object(path), int(time.time() * 1000))))
        return
    if values == ["stop"]:
        write_object(path, {})
        print("Foco encerrado.")
        return
    if values in (["pause"], ["resume"]):
        focus = read_object(path)
        now = int(time.time() * 1000)
        info = focus_info(focus, now)
        if not info or info["phase"] == "done":
            raise ValueError("Nenhum foco em andamento.")
        if values == ["pause"] and not info["paused"]:
            focus["paused_at"] = now
            write_object(path, focus)
        elif values == ["resume"] and info["paused"]:
            focus["started_at"] += now - focus["paused_at"]
            focus["paused_at"] = None
            write_object(path, focus)
        print(focus_text(focus_info(focus, now)))
        return
    if len(values) != 3:
        parser.error("use focus TRABALHO PAUSA RODADAS ou focus status|pause|resume|stop")
    try:
        work, rest, rounds = map(int, values)
    except ValueError:
        parser.error("trabalho, pausa e rodadas devem ser números inteiros")
    if not (1 <= work <= 1440 and 0 <= rest <= 1440 and 1 <= rounds <= 100):
        parser.error("trabalho: 1–1440 min; pausa: 0–1440 min; rodadas: 1–100")
    write_object(path, {"work_min": work, "break_min": rest, "rounds": rounds,
                        "started_at": int(time.time() * 1000), "paused_at": None})
    print(f"Foco iniciado: {work}/{rest} min · {rounds} rodadas.")


def main(argv):
    parser = argparse.ArgumentParser(prog="agent-pet", description="Sessões, foco e personagens do Retro Agent Pet.")
    commands = parser.add_subparsers(dest="command", required=True)
    setup_parser = commands.add_parser("setup", help="instalar os hooks dos agentes")
    setup_parser.add_argument("--yes", action="store_true")
    commands.add_parser("check", help="conferir a instalação dos hooks")
    status_parser = commands.add_parser("status", help="consultar sessões visíveis, foco, personagem e limites")
    status_parser.add_argument("--json", action="store_true", help="saída JSON para automações")
    focus_parser = commands.add_parser("focus", help="consultar ou controlar o foco")
    focus_parser.add_argument("values", nargs="*", metavar="AÇÃO_OU_MINUTOS",
                              help="TRABALHO PAUSA RODADAS ou status|pause|resume|stop")
    pet_parser = commands.add_parser("pet", help="consultar ou escolher o personagem")
    pet_parser.add_argument("character", nargs="?", choices=characters())
    args = parser.parse_args(argv)
    try:
        if args.command == "setup":
            return setup(assume_yes=args.yes)
        if args.command == "check":
            return check()
        if args.command == "status":
            data = status_data()
            if args.json:
                print(json.dumps(data, ensure_ascii=False, allow_nan=False))
            else:
                show_status(data)
        elif args.command == "focus":
            control_focus(args.values, focus_parser)
        elif args.command == "pet":
            config = read_object(config_path())
            if args.character:
                config["character"] = args.character
                write_object(config_path(), config)
            current = config.get("character")
            print(f"Personagem: {current if current in characters() else 'computer'}")
            if not args.character:
                print("Disponíveis: " + ", ".join(characters()))
    except (OSError, ValueError) as error:
        print(f"Erro: {error}", file=sys.stderr)
        return 1
    return 0
