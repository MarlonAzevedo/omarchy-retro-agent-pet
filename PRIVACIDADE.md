# Privacidade

O Retro Agent Pet acompanha eventos locais do Claude Code e do Codex. O código do pet não envia sessões, recados, configurações ou dados de uso para a internet. O painel reaproveita os dados e coletores do widget Agents do Omarchy; consulte também a política do Omarchy para saber como esses coletores obtêm dados de uso e limites.

## O que lê

- `~/.local/state/agent-pet/sessions/*.json`: estado das sessões, pasta do projeto, ferramenta atual e um resumo curto da atividade. O pet não lê transcrições.
- `~/.local/state/agent-pet/day/<AAAA-MM-DD>.json`: respostas concluídas e segundos de atividade do dia.
- `~/.local/state/agent-pet/focus.json`: rodada e horário do foco.
- `~/.config/agent-pet/config.json`: personagem, idioma, agentes ocultos, modo discreto e outras preferências.
- `characters/` do plugin e `~/.config/agent-pet/characters/`: desenhos e recados. O painel e a CLI respeitam `XDG_CONFIG_HOME` quando definido.
- Dados locais de uso e limites que o widget Agents do Omarchy já coleta, incluindo os arquivos em `~/.local/state/omarchy/agents/usage/`.

## O que grava

- `config.json` ao alterar preferências ou escolher um personagem.
- `focus.json` ao iniciar, pausar, retomar ou parar o foco.
- Com a instalação dos hooks confirmada, entradas em `~/.claude/settings.json` e `~/.codex/hooks.json` para executar `pet-hook.py`. Antes de alterar um arquivo existente, a instalação cria uma cópia `.bak.<data>` ao lado dele.
- Os hooks gravam os arquivos de sessão em `sessions/` e o resumo em `day/`. Os arquivos de sessão são criados com permissão `600`.

## Como apagar

1. Remova o plugin com `omarchy plugin remove io.github.marlonazevedo.agent-pet`.
2. Remova somente as entradas que executam `pet-hook.py` de `~/.claude/settings.json` e `~/.codex/hooks.json`. As cópias `.bak.<data>` podem ajudar a conferir o conteúdo anterior; não substitua o arquivo inteiro se outros hooks foram adicionados depois.
3. Apague `~/.local/state/agent-pet/` para remover sessões, totais diários e foco. Apague `~/.config/agent-pet/` para remover preferências, personagens e recados próprios. Se usa `XDG_STATE_HOME` ou `XDG_CONFIG_HOME`, procure as pastas correspondentes nesses diretórios.

Os arquivos de uso do Omarchy pertencem ao widget Agents e não são apagados ao remover o pet.
