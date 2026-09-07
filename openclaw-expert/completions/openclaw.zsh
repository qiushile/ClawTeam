
#compdef openclaw

_openclaw_root_completion() {
  local -a commands
  local -a options
  
  _arguments -C \
    "(--version -V)"{--version,-V}"[output the version number]" \
    "--container[Run the CLI inside a running Podman/Docker container named <name> (default: env OPENCLAW_CONTAINER)]:container:" \
    "--dev[Dev profile: isolate state under ~/.openclaw-dev, default gateway port 19001, and shift derived ports (browser/canvas)]" \
    "--profile[Use a named profile (isolates OPENCLAW_STATE_DIR/OPENCLAW_CONFIG_PATH under ~/.openclaw-<name>)]:profile:" \
    "--log-level[Global log level override for file + console (silent|fatal|error|warn|info|debug|trace)]:logLevel:" \
    "--no-color[Disable ANSI colors]" \
    "1: :_values 'command' 'acp[Run an ACP bridge backed by the Gateway]' 'agent[Run an agent turn via the Gateway (use --local for embedded)]' 'agents[Manage isolated agents (workspaces + auth + routing)]' 'approvals[Manage approval policy and pending requests]' 'exec-approvals[Manage approval policy and pending requests]' 'attach[Attach Claude Code to a gateway session with scoped MCP tools]' 'audit[Inspect activity records and exact-run identity context]' 'backup[Create, verify, and restore backup archives and SQLite snapshots]' 'channels[Manage connected chat channels and accounts]' 'clawbot[Legacy clawbot command aliases]' 'completion[Generate shell completion script]' 'config[Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.]' 'configure[Interactive configuration for credentials, channels, gateway, and agent defaults]' 'connect[Connect this machine to an OpenClaw Gateway as a node]' 'cron[Manage automations (via Gateway)]' 'automations[Manage automations (via Gateway)]' 'daemon[Manage the Gateway service (launchd/systemd/schtasks)]' 'dashboard[Open the Control UI with your current token]' 'database[Inspect shared-state schema compatibility and write ownership]' 'devices[Device pairing and auth tokens]' 'directory[Lookup contact and group IDs (self, peers, groups) for supported chat channels]' 'dns[DNS helpers for wide-area discovery (Tailscale + CoreDNS)]' 'docs[Search the live OpenClaw docs]' 'doctor[Health checks + quick fixes for the gateway and channels]' 'exec-policy[Show or synchronize requested exec policy with host approvals]' 'fleet[Provision and manage isolated tenant cells (experimental)]' 'gateway[Run, inspect, and query the WebSocket Gateway]' 'health[Fetch health from the running gateway]' 'hooks[Manage internal agent hooks]' 'infer[Run provider-backed inference commands through a stable CLI surface]' 'capability[Run provider-backed inference commands through a stable CLI surface]' 'logs[Tail gateway file logs via RPC]' 'mcp[Manage OpenClaw mcp.servers config and channel bridge]' 'message[Send, read, and manage messages and channel actions]' 'migrate[Import state from another agent system]' 'models[Model discovery, scanning, and configuration]' 'node[Run and manage the headless node host service]' 'nodes[Manage gateway-owned nodes (pairing, status, invoke, and media)]' 'onboard[Guided setup for auth, models, Gateway, workspace, channels, and skills]' 'pairing[Secure DM pairing (approve inbound requests)]' 'plugins[Manage OpenClaw plugins and extensions]' 'promos[Discover and claim promotional model offers from ClawHub]' 'proxy[Run the OpenClaw debug proxy and inspect captured traffic]' 'qr[Generate a mobile pairing QR code and setup code]' 'reset[Reset local config/state (keeps the CLI installed)]' 'resume[Resume a recent Gateway session in the TUI]' 'sandbox[Manage sandbox containers (Docker-based agent isolation)]' 'secrets[Secrets runtime controls]' 'security[Audit local config and state for common security foot-guns]' 'sessions[List stored conversation sessions]' 'setup[Chat with OpenClaw; onboard when setup is incomplete]' 'skills[List and inspect available skills]' 'status[Show channel health and recent session recipients]' 'system[System tools (events, heartbeat, presence)]' 'tasks[Inspect durable background tasks and TaskFlow state]' 'telemetry[Inspect and manage anonymous usage telemetry]' 'transcripts[Inspect stored transcripts]' 'triage[Collect sanitized diagnostics and open a local coding agent for repair]' 'tui[Open a terminal UI connected to the Gateway]' 'terminal[Open a terminal UI connected to the Gateway]' 'chat[Open a terminal UI connected to the Gateway]' 'uninstall[Uninstall the gateway service + local data (CLI remains)]' 'update[Update OpenClaw and inspect update channel status]' 'users[Manage durable user profiles and email aliases]' 'webhooks[Webhook helpers and integrations]' 'worker[Run the restricted cloud worker runtime]' 'worktrees[Create, inspect, restore, and clean up managed worktrees]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (completion) _openclaw_completion ;;
        (setup) _openclaw_setup ;;
        (crestodian) _openclaw_crestodian ;;
        (onboard) _openclaw_onboard ;;
        (configure) _openclaw_configure ;;
        (config) _openclaw_config ;;
        (backup) _openclaw_backup ;;
        (database) _openclaw_database ;;
        (migrate) _openclaw_migrate ;;
        (doctor) _openclaw_doctor ;;
        (triage) _openclaw_triage ;;
        (dashboard) _openclaw_dashboard ;;
        (reset) _openclaw_reset ;;
        (uninstall) _openclaw_uninstall ;;
        (message) _openclaw_message ;;
        (mcp) _openclaw_mcp ;;
        (transcripts) _openclaw_transcripts ;;
        (agent) _openclaw_agent ;;
        (agents) _openclaw_agents ;;
        (audit) _openclaw_audit ;;
        (status) _openclaw_status ;;
        (health) _openclaw_health ;;
        (sessions) _openclaw_sessions ;;
        (tasks) _openclaw_tasks ;;
        (acp) _openclaw_acp ;;
        (gateway) _openclaw_gateway ;;
        (daemon) _openclaw_daemon ;;
        (logs) _openclaw_logs ;;
        (system) _openclaw_system ;;
        (models) _openclaw_models ;;
        (promos) _openclaw_promos ;;
        (telemetry) _openclaw_telemetry ;;
        (infer|capability) _openclaw_infer ;;
        (approvals|exec-approvals) _openclaw_approvals ;;
        (exec-policy) _openclaw_exec_policy ;;
        (nodes) _openclaw_nodes ;;
        (devices) _openclaw_devices ;;
        (users) _openclaw_users ;;
        (node) _openclaw_node ;;
        (connect) _openclaw_connect ;;
        (worker) _openclaw_worker ;;
        (sandbox) _openclaw_sandbox ;;
        (fleet) _openclaw_fleet ;;
        (worktrees) _openclaw_worktrees ;;
        (attach) _openclaw_attach ;;
        (resume) _openclaw_resume ;;
        (tui|terminal|chat) _openclaw_tui ;;
        (cron|automations) _openclaw_cron ;;
        (dns) _openclaw_dns ;;
        (docs) _openclaw_docs ;;
        (proxy) _openclaw_proxy ;;
        (hooks) _openclaw_hooks ;;
        (webhooks) _openclaw_webhooks ;;
        (qr) _openclaw_qr ;;
        (clawbot) _openclaw_clawbot ;;
        (pairing) _openclaw_pairing ;;
        (plugins) _openclaw_plugins ;;
        (channels) _openclaw_channels ;;
        (directory) _openclaw_directory ;;
        (security) _openclaw_security ;;
        (secrets) _openclaw_secrets ;;
        (skills) _openclaw_skills ;;
        (update) _openclaw_update ;;
      esac
      ;;
  esac
}


_openclaw_completion() {
  _arguments -C \
    "(--shell -s)"{--shell,-s}"[Shell to generate completion for (default: detected)]:shell:(zsh bash powershell fish)" \
    "(--install -i)"{--install,-i}"[Install completion script to shell profile]" \
    "--write-state[Write completion scripts to \$OPENCLAW_STATE_DIR/completions (no stdout)]" \
    "(--yes -y)"{--yes,-y}"[Skip confirmation (non-interactive)]"
}

_openclaw_setup() {
  _arguments -C \
    "--workspace[Workspace proposal for guided setup; persisted by baseline/classic/non-interactive setup]:workspace:" \
    "--agent-name[Name for the first agent (default: main)]:agentName:" \
    "--wizard[Run interactive onboarding]" \
    "--baseline[Create baseline config/workspace/session folders without onboarding]" \
    "--reset[Reset config + credentials + sessions before running onboarding (workspace only with --reset-scope full)]" \
    "--reset-scope[Reset scope: config|config+creds+sessions|full]:resetScope:" \
    "--non-interactive[Run onboarding without prompts]" \
    "--classic[Use the classic multi-step setup wizard]" \
    "--tui[Use the terminal hatch instead of the browser handoff]" \
    "--accept-risk[Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)]" \
    "--flow[Onboard flow: quickstart|advanced|manual|import]:flow:" \
    "--mode[Onboard mode: local|remote]:mode:" \
    "--auth-choice[Auth: custom-api-key|setup-token|token|apiKey|skip|alibaba-model-studio-api-key|anthropic-cli|arceeai-api-key|baseten-api-key|byteplus-api-key|cerebras-api-key|openai-device-code|openai|chutes|chutes-api-key|clawrouter-api-key|cloudflare-ai-gateway-api-key|zai-cn|qwen-api-key-cn|qwen-api-key|zai-coding-cn|zai-coding-global|cohere-api-key|comfy-cloud-api-key|copilot-proxy|deepinfra-api-key|deepseek-api-key|fal-api-key|featherless-api-key|fireworks-api-key|github-copilot|github-copilot-enterprise|zai-global|gmi-api-key|gemini-api-key|google-vertex-api-key|groq-api-key|huggingface-api-key|kilocode-api-key|kimi-code-api-key|litellm-api-key|lmstudio|longcat-api-key|meta-api-key|microsoft-foundry-apikey|microsoft-foundry-entra|minimax-cn-api|minimax-global-api|minimax-cn-oauth|minimax-global-oauth|mistral-api-key|moonshot-api-key|moonshot-api-key-cn|novita-api-key|nvidia-api-key|ollama|ollama-cloud|openai-api-key|opencode-go|opencode-zen|arceeai-openrouter|openrouter-api-key|openrouter-oauth|pixverse-api-key|qianfan-api-key|qwen-token-plan-cn|qwen-token-plan|runway-api-key|sglang|qwen-standard-api-key-cn|qwen-standard-api-key|stepfun-standard-api-key-cn|stepfun-standard-api-key-intl|stepfun-plan-api-key-cn|stepfun-plan-api-key-intl|synthetic-api-key|tokenhub-api-key|tokenplan-api-key|together-api-key|venice-api-key|ai-gateway-api-key|vllm|volcengine-api-key|vydra-api-key|xai-api-key|xai-device-code|xai-oauth|xiaomi-api-key|xiaomi-token-plan-cn|xiaomi-token-plan-ams|xiaomi-token-plan-sgp|zai-api-key]:authChoice:" \
    "--token-provider[Token provider id (non-interactive; used with --auth-choice token)]:tokenProvider:" \
    "--token[Token value (non-interactive; used with --auth-choice token)]:token:" \
    "--token-profile-id[Auth profile id (non-interactive; default: <provider>:manual)]:tokenProfileId:" \
    "--token-expires-in[Optional token expiry duration (e.g. 365d, 12h)]:tokenExpiresIn:" \
    "--secret-input-mode[Credential persistence mode: plaintext|ref (default: plaintext)]:secretInputMode:" \
    "--cloudflare-ai-gateway-account-id[Cloudflare Account ID]:cloudflareAiGatewayAccountId:" \
    "--cloudflare-ai-gateway-gateway-id[Cloudflare AI Gateway ID]:cloudflareAiGatewayGatewayId:" \
    "--alibaba-model-studio-api-key[Alibaba Model Studio API key]:alibabaModelStudioApiKey:" \
    "--anthropic-api-key[Anthropic API key]:anthropicApiKey:" \
    "--clawrouter-api-key[ClawRouter proxy key]:clawrouterApiKey:" \
    "--fal-api-key[fal API key]:falApiKey:" \
    "--github-copilot-token[GitHub Copilot OAuth token]:githubCopilotToken:" \
    "--gemini-api-key[Gemini API key]:geminiApiKey:" \
    "--huggingface-api-key[Hugging Face API key (HF token)]:huggingfaceApiKey:" \
    "--litellm-api-key[LiteLLM API key]:litellmApiKey:" \
    "--lmstudio-api-key[LM Studio API key]:lmstudioApiKey:" \
    "--minimax-api-key[MiniMax API key]:minimaxApiKey:" \
    "--nvidia-api-key[NVIDIA API key]:nvidiaApiKey:" \
    "--ollama-cloud-api-key[Ollama Cloud API key]:ollamaCloudApiKey:" \
    "--openai-api-key[OpenAI API Key]:openaiApiKey:" \
    "--opencode-go-api-key[OpenCode API key (Go catalog)]:opencodeGoApiKey:" \
    "--openrouter-api-key[OpenRouter API key]:openrouterApiKey:" \
    "--runway-api-key[Runway API key]:runwayApiKey:" \
    "--together-api-key[Together AI API key]:togetherApiKey:" \
    "--xai-api-key[xAI API key]:xaiApiKey:" \
    "--kimi-code-api-key[Kimi Code API key (subscription)]:kimiCodeApiKey:" \
    "--moonshot-api-key[Moonshot API key]:moonshotApiKey:" \
    "--arceeai-api-key[Arcee AI API key]:arceeaiApiKey:" \
    "--baseten-api-key[Baseten API key]:basetenApiKey:" \
    "--byteplus-api-key[BytePlus API key]:byteplusApiKey:" \
    "--cerebras-api-key[Cerebras API key]:cerebrasApiKey:" \
    "--chutes-api-key[Chutes API key]:chutesApiKey:" \
    "--cohere-api-key[Cohere API key]:cohereApiKey:" \
    "--cloudflare-ai-gateway-api-key[Cloudflare AI Gateway API key]:cloudflareAiGatewayApiKey:" \
    "--comfy-api-key[Comfy Cloud API key]:comfyApiKey:" \
    "--deepinfra-api-key[DeepInfra API key]:deepinfraApiKey:" \
    "--deepseek-api-key[DeepSeek API key]:deepseekApiKey:" \
    "--featherless-api-key[Featherless AI API key]:featherlessApiKey:" \
    "--gmi-api-key[GMI Cloud API key]:gmiApiKey:" \
    "--longcat-api-key[LongCat API key]:longcatApiKey:" \
    "--meta-api-key[Meta API key]:metaApiKey:" \
    "--mistral-api-key[Mistral API key]:mistralApiKey:" \
    "--novita-api-key[NovitaAI API key]:novitaApiKey:" \
    "--opencode-zen-api-key[OpenCode API key (Zen catalog)]:opencodeZenApiKey:" \
    "--groq-api-key[Groq API key]:groqApiKey:" \
    "--kilocode-api-key[Kilo Gateway API key]:kilocodeApiKey:" \
    "--pixverse-api-key[PixVerse API key]:pixverseApiKey:" \
    "--qianfan-api-key[QIANFAN API key]:qianfanApiKey:" \
    "--modelstudio-standard-api-key-cn[Qwen Cloud standard API key (China)]:modelstudioStandardApiKeyCn:" \
    "--modelstudio-standard-api-key[Qwen Cloud standard API key (Global/Intl)]:modelstudioStandardApiKey:" \
    "--modelstudio-api-key-cn[Qwen Cloud Coding Plan API key (China)]:modelstudioApiKeyCn:" \
    "--modelstudio-api-key[Qwen Cloud Coding Plan API key (Global/Intl)]:modelstudioApiKey:" \
    "--qwen-token-plan-api-key[Qwen Token Plan API key (Global/Intl)]:qwenTokenPlanApiKey:" \
    "--qwen-token-plan-api-key-cn[Qwen Token Plan API key (China)]:qwenTokenPlanApiKeyCn:" \
    "--fireworks-api-key[Fireworks API key]:fireworksApiKey:" \
    "--tokenhub-api-key[Tencent TokenHub API key]:tokenhubApiKey:" \
    "--tokenplan-api-key[Tencent TokenPlan API key]:tokenplanApiKey:" \
    "--venice-api-key[Venice API key]:veniceApiKey:" \
    "--ai-gateway-api-key[Vercel AI Gateway API key]:aiGatewayApiKey:" \
    "--vydra-api-key[Vydra API key]:vydraApiKey:" \
    "--xiaomi-api-key[Xiaomi MiMo pay-as-you-go API key]:xiaomiApiKey:" \
    "--xiaomi-token-plan-api-key[Xiaomi MiMo Token Plan API key]:xiaomiTokenPlanApiKey:" \
    "--zai-api-key[Z.AI API key]:zaiApiKey:" \
    "--synthetic-api-key[Synthetic API key]:syntheticApiKey:" \
    "--volcengine-api-key[Volcano Engine API key]:volcengineApiKey:" \
    "--stepfun-api-key[StepFun API key]:stepfunApiKey:" \
    "--custom-base-url[Custom provider base URL]:customBaseUrl:" \
    "--custom-api-key[Custom provider API key (optional)]:customApiKey:" \
    "--custom-model-id[Custom provider model ID]:customModelId:" \
    "--custom-provider-id[Custom provider ID (optional; auto-derived by default)]:customProviderId:" \
    "--custom-compatibility[Custom provider API compatibility: openai|openai-responses|anthropic (default: openai)]:customCompatibility:" \
    "--custom-image-input[Mark the custom provider model as image-capable]" \
    "--custom-text-input[Mark the custom provider model as text-only]" \
    "--gateway-port[Gateway port]:gatewayPort:" \
    "--gateway-bind[Gateway bind: loopback|tailnet|lan|auto|custom]:gatewayBind:" \
    "--gateway-auth[Gateway auth: token|password]:gatewayAuth:" \
    "--gateway-token[Gateway token (token auth)]:gatewayToken:" \
    "--gateway-token-ref-env[Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)]:gatewayTokenRefEnv:" \
    "--gateway-password[Gateway password (password auth)]:gatewayPassword:" \
    "--tailscale[Tailscale: off|serve|funnel]:tailscale:" \
    "!--tailscale-reset-on-exit[]" \
    "!--no-tailscale-reset-on-exit[]" \
    "--install-daemon[Install gateway service]" \
    "--no-install-daemon[Skip gateway service install]" \
    "--skip-daemon[Skip gateway service install]" \
    "--daemon-runtime[Daemon runtime: node|bun (default: node)]:daemonRuntime:" \
    "--skip-channels[Skip channel setup]" \
    "--skip-skills[Skip skills setup]" \
    "--skip-bootstrap[Skip creating default agent workspace files]" \
    "--skip-search[Skip search provider setup]" \
    "--skip-health[Skip health check]" \
    "--skip-ui[Skip Control UI/TUI launch]" \
    "--suppress-gateway-token-output[Disable the guided Control UI handoff]" \
    "--skip-hooks[Accepted for onboard compatibility; hooks setup is skipped]" \
    "--node-manager[Node manager for skills: npm|pnpm|bun]:nodeManager:" \
    "--import-from[Migration provider to run during onboarding]:importFrom:" \
    "--import-source[Source agent home for --import-from]:importSource:" \
    "--import-secrets[Import supported secrets during onboarding migration]" \
    "--remote-url[Remote Gateway WebSocket URL]:remoteUrl:" \
    "--remote-token[Remote Gateway token (optional)]:remoteToken:" \
    "--remote-password[Remote Gateway password (optional)]:remotePassword:" \
    "(--message -m)"{--message,-m}"[Run one OpenClaw request]:message:" \
    "--yes[Approve persistent config writes for one --message request]" \
    "--json[Output system overview or onboarding summary as JSON]"
}

_openclaw_crestodian() {
  _arguments -C \
    "(--message -m)"{--message,-m}"[Run one OpenClaw request]:message:" \
    "--yes[Approve persistent config writes for one --message request]" \
    "--json[Output system overview or onboarding summary as JSON]"
}

_openclaw_onboard_recommendations_acknowledge() {
  _arguments -C \
    "--retry[Leave failed recommendation IDs pending for a later run]:retry:"
}

_openclaw_onboard_recommendations_refresh() {
  _arguments -C \
    
}

_openclaw_onboard_recommendations() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output stored recommendation matches as JSON]" \
    "1: :_values 'command' 'acknowledge[Mark the stored onboarding recommendation offer as answered]' 'refresh[Clear stored app recommendations so the next onboarding run rescans]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (acknowledge) _openclaw_onboard_recommendations_acknowledge ;;
        (refresh) _openclaw_onboard_recommendations_refresh ;;
      esac
      ;;
  esac
}

_openclaw_onboard() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--workspace[Workspace proposal for guided setup; persisted by classic/non-interactive setup]:workspace:" \
    "--agent-name[Name for the first agent (default: main)]:agentName:" \
    "--reset[Reset config + credentials + sessions before running onboard (workspace only with --reset-scope full)]" \
    "--reset-scope[Reset scope: config|config+creds+sessions|full]:resetScope:" \
    "--non-interactive[Run without prompts]" \
    "--modern[Open inference-gated OpenClaw (kept for compatibility)]" \
    "--classic[Use the classic multi-step setup wizard]" \
    "--tui[Use the terminal hatch instead of the browser handoff]" \
    "--accept-risk[Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)]" \
    "--flow[Onboard flow: quickstart|advanced|manual|import]:flow:" \
    "--mode[Onboard mode: local|remote]:mode:" \
    "--auth-choice[Auth: custom-api-key|setup-token|token|apiKey|skip|alibaba-model-studio-api-key|anthropic-cli|arceeai-api-key|baseten-api-key|byteplus-api-key|cerebras-api-key|openai-device-code|openai|chutes|chutes-api-key|clawrouter-api-key|cloudflare-ai-gateway-api-key|zai-cn|qwen-api-key-cn|qwen-api-key|zai-coding-cn|zai-coding-global|cohere-api-key|comfy-cloud-api-key|copilot-proxy|deepinfra-api-key|deepseek-api-key|fal-api-key|featherless-api-key|fireworks-api-key|github-copilot|github-copilot-enterprise|zai-global|gmi-api-key|gemini-api-key|google-vertex-api-key|groq-api-key|huggingface-api-key|kilocode-api-key|kimi-code-api-key|litellm-api-key|lmstudio|longcat-api-key|meta-api-key|microsoft-foundry-apikey|microsoft-foundry-entra|minimax-cn-api|minimax-global-api|minimax-cn-oauth|minimax-global-oauth|mistral-api-key|moonshot-api-key|moonshot-api-key-cn|novita-api-key|nvidia-api-key|ollama|ollama-cloud|openai-api-key|opencode-go|opencode-zen|arceeai-openrouter|openrouter-api-key|openrouter-oauth|pixverse-api-key|qianfan-api-key|qwen-token-plan-cn|qwen-token-plan|runway-api-key|sglang|qwen-standard-api-key-cn|qwen-standard-api-key|stepfun-standard-api-key-cn|stepfun-standard-api-key-intl|stepfun-plan-api-key-cn|stepfun-plan-api-key-intl|synthetic-api-key|tokenhub-api-key|tokenplan-api-key|together-api-key|venice-api-key|ai-gateway-api-key|vllm|volcengine-api-key|vydra-api-key|xai-api-key|xai-device-code|xai-oauth|xiaomi-api-key|xiaomi-token-plan-cn|xiaomi-token-plan-ams|xiaomi-token-plan-sgp|zai-api-key]:authChoice:" \
    "--token-provider[Token provider id (non-interactive; used with --auth-choice token)]:tokenProvider:" \
    "--token[Token value (non-interactive; used with --auth-choice token)]:token:" \
    "--token-profile-id[Auth profile id (non-interactive; default: <provider>:manual)]:tokenProfileId:" \
    "--token-expires-in[Optional token expiry duration (e.g. 365d, 12h)]:tokenExpiresIn:" \
    "--secret-input-mode[Credential persistence mode: plaintext|ref (default: plaintext)]:secretInputMode:" \
    "--cloudflare-ai-gateway-account-id[Cloudflare Account ID]:cloudflareAiGatewayAccountId:" \
    "--cloudflare-ai-gateway-gateway-id[Cloudflare AI Gateway ID]:cloudflareAiGatewayGatewayId:" \
    "--alibaba-model-studio-api-key[Alibaba Model Studio API key]:alibabaModelStudioApiKey:" \
    "--anthropic-api-key[Anthropic API key]:anthropicApiKey:" \
    "--clawrouter-api-key[ClawRouter proxy key]:clawrouterApiKey:" \
    "--fal-api-key[fal API key]:falApiKey:" \
    "--github-copilot-token[GitHub Copilot OAuth token]:githubCopilotToken:" \
    "--gemini-api-key[Gemini API key]:geminiApiKey:" \
    "--huggingface-api-key[Hugging Face API key (HF token)]:huggingfaceApiKey:" \
    "--litellm-api-key[LiteLLM API key]:litellmApiKey:" \
    "--lmstudio-api-key[LM Studio API key]:lmstudioApiKey:" \
    "--minimax-api-key[MiniMax API key]:minimaxApiKey:" \
    "--nvidia-api-key[NVIDIA API key]:nvidiaApiKey:" \
    "--ollama-cloud-api-key[Ollama Cloud API key]:ollamaCloudApiKey:" \
    "--openai-api-key[OpenAI API Key]:openaiApiKey:" \
    "--opencode-go-api-key[OpenCode API key (Go catalog)]:opencodeGoApiKey:" \
    "--openrouter-api-key[OpenRouter API key]:openrouterApiKey:" \
    "--runway-api-key[Runway API key]:runwayApiKey:" \
    "--together-api-key[Together AI API key]:togetherApiKey:" \
    "--xai-api-key[xAI API key]:xaiApiKey:" \
    "--kimi-code-api-key[Kimi Code API key (subscription)]:kimiCodeApiKey:" \
    "--moonshot-api-key[Moonshot API key]:moonshotApiKey:" \
    "--arceeai-api-key[Arcee AI API key]:arceeaiApiKey:" \
    "--baseten-api-key[Baseten API key]:basetenApiKey:" \
    "--byteplus-api-key[BytePlus API key]:byteplusApiKey:" \
    "--cerebras-api-key[Cerebras API key]:cerebrasApiKey:" \
    "--chutes-api-key[Chutes API key]:chutesApiKey:" \
    "--cohere-api-key[Cohere API key]:cohereApiKey:" \
    "--cloudflare-ai-gateway-api-key[Cloudflare AI Gateway API key]:cloudflareAiGatewayApiKey:" \
    "--comfy-api-key[Comfy Cloud API key]:comfyApiKey:" \
    "--deepinfra-api-key[DeepInfra API key]:deepinfraApiKey:" \
    "--deepseek-api-key[DeepSeek API key]:deepseekApiKey:" \
    "--featherless-api-key[Featherless AI API key]:featherlessApiKey:" \
    "--gmi-api-key[GMI Cloud API key]:gmiApiKey:" \
    "--longcat-api-key[LongCat API key]:longcatApiKey:" \
    "--meta-api-key[Meta API key]:metaApiKey:" \
    "--mistral-api-key[Mistral API key]:mistralApiKey:" \
    "--novita-api-key[NovitaAI API key]:novitaApiKey:" \
    "--opencode-zen-api-key[OpenCode API key (Zen catalog)]:opencodeZenApiKey:" \
    "--groq-api-key[Groq API key]:groqApiKey:" \
    "--kilocode-api-key[Kilo Gateway API key]:kilocodeApiKey:" \
    "--pixverse-api-key[PixVerse API key]:pixverseApiKey:" \
    "--qianfan-api-key[QIANFAN API key]:qianfanApiKey:" \
    "--modelstudio-standard-api-key-cn[Qwen Cloud standard API key (China)]:modelstudioStandardApiKeyCn:" \
    "--modelstudio-standard-api-key[Qwen Cloud standard API key (Global/Intl)]:modelstudioStandardApiKey:" \
    "--modelstudio-api-key-cn[Qwen Cloud Coding Plan API key (China)]:modelstudioApiKeyCn:" \
    "--modelstudio-api-key[Qwen Cloud Coding Plan API key (Global/Intl)]:modelstudioApiKey:" \
    "--qwen-token-plan-api-key[Qwen Token Plan API key (Global/Intl)]:qwenTokenPlanApiKey:" \
    "--qwen-token-plan-api-key-cn[Qwen Token Plan API key (China)]:qwenTokenPlanApiKeyCn:" \
    "--fireworks-api-key[Fireworks API key]:fireworksApiKey:" \
    "--tokenhub-api-key[Tencent TokenHub API key]:tokenhubApiKey:" \
    "--tokenplan-api-key[Tencent TokenPlan API key]:tokenplanApiKey:" \
    "--venice-api-key[Venice API key]:veniceApiKey:" \
    "--ai-gateway-api-key[Vercel AI Gateway API key]:aiGatewayApiKey:" \
    "--vydra-api-key[Vydra API key]:vydraApiKey:" \
    "--xiaomi-api-key[Xiaomi MiMo pay-as-you-go API key]:xiaomiApiKey:" \
    "--xiaomi-token-plan-api-key[Xiaomi MiMo Token Plan API key]:xiaomiTokenPlanApiKey:" \
    "--zai-api-key[Z.AI API key]:zaiApiKey:" \
    "--synthetic-api-key[Synthetic API key]:syntheticApiKey:" \
    "--volcengine-api-key[Volcano Engine API key]:volcengineApiKey:" \
    "--stepfun-api-key[StepFun API key]:stepfunApiKey:" \
    "--custom-base-url[Custom provider base URL]:customBaseUrl:" \
    "--custom-api-key[Custom provider API key (optional)]:customApiKey:" \
    "--custom-model-id[Custom provider model ID]:customModelId:" \
    "--custom-provider-id[Custom provider ID (optional; auto-derived by default)]:customProviderId:" \
    "--custom-compatibility[Custom provider API compatibility: openai|openai-responses|anthropic (default: openai)]:customCompatibility:" \
    "--custom-image-input[Mark the custom provider model as image-capable]" \
    "--custom-text-input[Mark the custom provider model as text-only]" \
    "--gateway-port[Gateway port]:gatewayPort:" \
    "--gateway-bind[Gateway bind: loopback|tailnet|lan|auto|custom]:gatewayBind:" \
    "--gateway-auth[Gateway auth: token|password]:gatewayAuth:" \
    "--gateway-token[Gateway token (token auth)]:gatewayToken:" \
    "--gateway-token-ref-env[Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)]:gatewayTokenRefEnv:" \
    "--gateway-password[Gateway password (password auth)]:gatewayPassword:" \
    "--remote-url[Remote Gateway WebSocket URL]:remoteUrl:" \
    "--remote-token[Remote Gateway token (optional)]:remoteToken:" \
    "--remote-password[Remote Gateway password (optional)]:remotePassword:" \
    "--tailscale[Tailscale: off|serve|funnel]:tailscale:" \
    "!--tailscale-reset-on-exit[]" \
    "!--no-tailscale-reset-on-exit[]" \
    "--install-daemon[Install gateway service]" \
    "--no-install-daemon[Skip gateway service install]" \
    "--skip-daemon[Skip gateway service install]" \
    "--daemon-runtime[Daemon runtime: node|bun (default: node)]:daemonRuntime:" \
    "--skip-channels[Skip channel setup]" \
    "--skip-skills[Skip skills setup]" \
    "--skip-bootstrap[Skip creating default agent workspace files]" \
    "--skip-search[Skip search provider setup]" \
    "--skip-health[Skip health check]" \
    "--skip-ui[Skip Control UI/TUI prompts]" \
    "--suppress-gateway-token-output[Disable the guided Control UI handoff]" \
    "--skip-hooks[Skip hook setup]" \
    "--node-manager[Node manager for skills: npm|pnpm|bun]:nodeManager:" \
    "--import-from[Migration provider to run during onboarding]:importFrom:" \
    "--import-source[Source agent home for --import-from]:importSource:" \
    "--import-secrets[Import supported secrets during onboarding migration]" \
    "--json[Output JSON summary]" \
    "1: :_values 'command' 'recommendations[Read the app recommendations stored during onboarding]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (recommendations) _openclaw_onboard_recommendations ;;
      esac
      ;;
  esac
}

_openclaw_configure() {
  _arguments -C \
    "--section[Configuration sections (repeatable). Options: workspace, model, web, gateway, daemon, channels, plugins, skills, health]:section:"
}

_openclaw_config_get() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_config_set() {
  _arguments -C \
    "--strict-json[Strict JSON parsing (error instead of raw string fallback)]" \
    "--json[Legacy alias for --strict-json]" \
    "--expect-current-absent[Write only when the authored path is absent]" \
    "--expect-current-json[Write only when the authored path exactly matches this strict JSON value]:expectCurrentJson:" \
    "--dry-run[Validate changes without writing openclaw.json (checks run in builder/json/batch modes; exec SecretRefs are skipped unless --allow-exec is set)]" \
    "--allow-exec[Dry-run only: allow exec SecretRef resolvability checks (may execute provider commands)]" \
    "--merge[Merge object/map values instead of replacing the target path]" \
    "--replace[Allow full replacement of protected map/list paths such as agents.defaults.models]" \
    "--ref-provider[SecretRef builder: provider alias]:refProvider:" \
    "--ref-source[SecretRef builder: source (env|file|exec|store)]:refSource:" \
    "--ref-id[SecretRef builder: ref id]:refId:" \
    "--provider-source[Provider builder: source (env|file|exec|store)]:providerSource:" \
    "--provider-allowlist[Provider builder (env): allowlist entry (repeatable)]:providerAllowlist:" \
    "--provider-path[Provider builder (file): path]:providerPath:" \
    "--provider-mode[Provider builder (file): mode (singleValue|json)]:providerMode:" \
    "--provider-timeout-ms[Provider builder (file|exec): timeout ms]:providerTimeoutMs:" \
    "--provider-max-bytes[Provider builder (file): max bytes]:providerMaxBytes:" \
    "--provider-command[Provider builder (exec): absolute command path]:providerCommand:" \
    "--provider-arg[Provider builder (exec): command arg (repeatable)]:providerArg:" \
    "--provider-no-output-timeout-ms[Provider builder (exec): no-output timeout ms]:providerNoOutputTimeoutMs:" \
    "--provider-max-output-bytes[Provider builder (exec): max output bytes]:providerMaxOutputBytes:" \
    "--provider-json-only[Provider builder (exec): require JSON output]" \
    "--provider-env[Provider builder (exec): env assignment (repeatable)]:providerEnv:" \
    "--provider-pass-env[Provider builder (exec): pass host env var (repeatable)]:providerPassEnv:" \
    "--provider-trusted-dir[Provider builder (exec): trusted directory (repeatable)]:providerTrustedDir:" \
    "--batch-json[Batch mode: JSON array of set operations]:batchJson:" \
    "--batch-file[Batch mode: read JSON array of set operations from file]:batchFile:"
}

_openclaw_config_patch() {
  _arguments -C \
    "--file[Read a JSON5 config patch object from file]:file:" \
    "--stdin[Read a JSON5 config patch object from stdin]" \
    "--dry-run[Validate changes without writing openclaw.json (checks schema and SecretRef resolvability; exec SecretRefs are skipped unless --allow-exec is set)]" \
    "--allow-exec[Dry-run only: allow exec SecretRef resolvability checks (may execute provider commands)]" \
    "--json[Output dry-run result as JSON]" \
    "--replace-path[Replace the object or array at this dot/bracket path instead of recursively applying it (repeatable)]:replacePath:"
}

_openclaw_config_unset() {
  _arguments -C \
    "--dry-run[validate the removal without writing the config file]" \
    "--allow-exec[allow exec SecretRef providers during --dry-run]" \
    "--json[print dry-run result as JSON]"
}

_openclaw_config_file() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_config_schema() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_config_validate() {
  _arguments -C \
    "--json[Output validation result as JSON]"
}

_openclaw_config() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--section[Configuration sections for guided setup (repeatable). Use with no subcommand.]:section:" \
    "1: :_values 'command' 'file[Print the active config file path]' 'get[Get a config value by dot path]' 'patch[Patch config from a JSON5 object in one validated write.
Objects merge recursively, arrays/scalars replace, and null deletes a path.
Examples:
openclaw config patch --file ./openclaw.patch.json5 --dry-run
openclaw config patch --stdin]' 'schema[Print the JSON schema for openclaw.json]' 'set[Set config values by path (value mode, ref/provider builder mode, or batch JSON mode).
Examples:
openclaw config set gateway.port 19001 --strict-json
openclaw config set channels.discord.token --ref-provider default --ref-source env --ref-id DISCORD_BOT_TOKEN
openclaw config set secrets.providers.vault --provider-source file --provider-path /etc/openclaw/secrets.json --provider-mode json
openclaw config set --batch-file ./config-set.batch.json --dry-run]' 'unset[Remove a config value by dot path]' 'validate[Validate the current config against the schema without starting the gateway]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (get) _openclaw_config_get ;;
        (set) _openclaw_config_set ;;
        (patch) _openclaw_config_patch ;;
        (unset) _openclaw_config_unset ;;
        (file) _openclaw_config_file ;;
        (schema) _openclaw_config_schema ;;
        (validate) _openclaw_config_validate ;;
      esac
      ;;
  esac
}

_openclaw_backup_create() {
  _arguments -C \
    "--output[Archive path or destination directory]:output:" \
    "--json[Output JSON]" \
    "--dry-run[Print the backup plan without writing the archive]" \
    "--verify[Verify the archive after writing it]" \
    "--only-config[Back up only the active JSON config file]" \
    "--no-include-workspace[Exclude workspace directories from the backup]"
}

_openclaw_backup_verify() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_backup_restore() {
  _arguments -C \
    "--target[Fresh target directory; non-empty directories are refused]:target:" \
    "--json[Output JSON]"
}

_openclaw_backup_sqlite_create() {
  _arguments -C \
    "--global[Snapshot the shared OpenClaw state database]" \
    "--agent[Snapshot one per-agent OpenClaw database]:agent:" \
    "--repository[Snapshot repository directory]:repository:" \
    "--json[Output JSON]"
}

_openclaw_backup_sqlite_list() {
  _arguments -C \
    "--repository[Snapshot repository directory]:repository:" \
    "--json[Output JSON]"
}

_openclaw_backup_sqlite_verify() {
  _arguments -C \
    "--scratch[Existing private directory for verification copies]:scratch:" \
    "--json[Output JSON]"
}

_openclaw_backup_sqlite_restore() {
  _arguments -C \
    "--target[Fresh target path; existing files and sidecars are refused]:target:" \
    "--json[Output JSON]"
}

_openclaw_backup_sqlite() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'create[Create a compact, verified snapshot of an OpenClaw SQLite database]' 'list[List committed snapshots in a repository]' 'restore[Restore a verified snapshot to a new SQLite database path]' 'verify[Verify a snapshot manifest, artifact hash, SQLite integrity, and database owner]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (create) _openclaw_backup_sqlite_create ;;
        (list) _openclaw_backup_sqlite_list ;;
        (verify) _openclaw_backup_sqlite_verify ;;
        (restore) _openclaw_backup_sqlite_restore ;;
      esac
      ;;
  esac
}

_openclaw_backup_git_init() {
  _arguments -C \
    "--repository[Git backup repository directory]:repository:" \
    "--remote[Add the remote as origin]:remote:" \
    "--json[Output JSON]"
}

_openclaw_backup_git_create() {
  _arguments -C \
    "--repository[Git backup repository directory]:repository:" \
    "--all[Back up the shared database and every registered agent database]" \
    "--global[Back up the shared OpenClaw state database]" \
    "--agent[Back up an agent database (repeatable)]:agent:" \
    "--push[Push the current branch to origin]" \
    "--exclude-secrets[Omit credential-bearing database tables]" \
    "--json[Output JSON]"
}

_openclaw_backup_git_log() {
  _arguments -C \
    "--repository[Git backup repository directory]:repository:" \
    "--limit[Maximum commits to show]:limit:" \
    "--json[Output JSON]"
}

_openclaw_backup_git_verify() {
  _arguments -C \
    "--repository[Git backup repository directory]:repository:" \
    "--ref[Commit or ref to verify]:ref:" \
    "--global[Verify the shared state database]" \
    "--agent[Verify one agent database]:agent:" \
    "--json[Output JSON]"
}

_openclaw_backup_git_restore() {
  _arguments -C \
    "--repository[Git backup repository directory]:repository:" \
    "--target[Fresh target path; existing files and sidecars are refused]:target:" \
    "--ref[Commit or ref to restore]:ref:" \
    "--global[Restore the shared state database]" \
    "--agent[Restore one agent database]:agent:" \
    "--json[Output JSON]"
}

_openclaw_backup_git() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'create[Dump selected OpenClaw databases and commit one Git revision]' 'init[Initialize or adopt an operator-owned Git backup repository]' 'log[Show Git backup commits]' 'restore[Restore one database snapshot from a Git ref to a fresh SQLite file]' 'verify[Restore and verify one database snapshot from a Git ref]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (init) _openclaw_backup_git_init ;;
        (create) _openclaw_backup_git_create ;;
        (log) _openclaw_backup_git_log ;;
        (verify) _openclaw_backup_git_verify ;;
        (restore) _openclaw_backup_git_restore ;;
      esac
      ;;
  esac
}

_openclaw_backup_enable() {
  _arguments -C \
    "--repository[Git backup repository directory]:repository:" \
    "--every[Backup interval]:every:" \
    "--push[Push the current branch to origin after each backup]" \
    "--exclude-secrets[Omit credential-bearing database tables]" \
    "--include-secrets[Keep credential-bearing tables in pushed scheduled backups]" \
    "--global-only[Back up only the shared state database]" \
    "--agent[Back up only one agent database]:agent:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_backup_disable() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_backup() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'create[Write a backup archive for config, credentials, sessions, and workspaces]' 'disable[Remove the scheduled Git backup automation]' 'enable[Provision a Gateway automation for scheduled Git backups]' 'git[Create and restore deterministic versioned SQLite dumps in Git]' 'restore[Restore a verified backup archive to a fresh staging directory]' 'sqlite[Create, list, verify, and restore SQLite snapshots]' 'verify[Validate a backup archive and its embedded manifest]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (create) _openclaw_backup_create ;;
        (verify) _openclaw_backup_verify ;;
        (restore) _openclaw_backup_restore ;;
        (sqlite) _openclaw_backup_sqlite ;;
        (git) _openclaw_backup_git ;;
        (enable) _openclaw_backup_enable ;;
        (disable) _openclaw_backup_disable ;;
      esac
      ;;
  esac
}

_openclaw_database_preflight() {
  _arguments -C \
    "--json[emit machine-readable JSON]"
}

_openclaw_database_ownership_status() {
  _arguments -C \
    "--json[emit machine-readable JSON]"
}

_openclaw_database_ownership_claim() {
  _arguments -C \
    "--manager[stable external manager identifier]:manager:" \
    "--json[emit machine-readable JSON]"
}

_openclaw_database_ownership() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'claim[Claim shared-state writes for the active external supervisor]' 'status[Show durable shared-state write ownership]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (status) _openclaw_database_ownership_status ;;
        (claim) _openclaw_database_ownership_claim ;;
      esac
      ;;
  esac
}

_openclaw_database() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'ownership[Inspect or claim write ownership]' 'preflight[Compare one copied SQLite file with this release'\''s state schema]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (preflight) _openclaw_database_preflight ;;
        (ownership) _openclaw_database_ownership ;;
      esac
      ;;
  esac
}

_openclaw_migrate_list() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_migrate_plan() {
  _arguments -C \
    "--from[Source directory to migrate from]:from:" \
    "--agent[Target agent (default: configured default agent)]:agent:" \
    "--include-secrets[Import supported credentials and secrets]" \
    "--no-auth-credentials[Skip auth credential migration]" \
    "--overwrite[Overwrite conflicting target files after item-level backups]" \
    "--json[Output JSON]" \
    "--skill[Select one skill to migrate by name or item id; repeat for multiple skills]:skill:" \
    "--plugin[Select one Codex plugin to migrate by name or item id; repeat for multiple plugins]:plugin:" \
    "--item[Select one exact migration item id; repeat for multiple items]:item:" \
    "--verify-plugin-apps[Codex only: verify source plugin app accessibility with app/installed before planning native plugin activation]"
}

_openclaw_migrate_apply() {
  _arguments -C \
    "--from[Source directory to migrate from]:from:" \
    "--agent[Target agent (default: configured default agent)]:agent:" \
    "--include-secrets[Import supported credentials and secrets]" \
    "--no-auth-credentials[Skip auth credential migration]" \
    "--overwrite[Overwrite conflicting target files after item-level backups]" \
    "--json[Output JSON]" \
    "--skill[Select one skill to migrate by name or item id; repeat for multiple skills]:skill:" \
    "--plugin[Select one Codex plugin to migrate by name or item id; repeat for multiple plugins]:plugin:" \
    "--item[Select one exact migration item id; repeat for multiple items]:item:" \
    "--verify-plugin-apps[Codex only: verify source plugin app accessibility with app/installed before planning native plugin activation]" \
    "--yes[Apply without prompting]" \
    "--backup-output[Pre-migration backup archive path or directory]:backupOutput:" \
    "--no-backup[Skip the pre-migration OpenClaw backup]" \
    "--force[Allow dangerous options such as --no-backup]"
}

_openclaw_migrate() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--from[Source directory to migrate from]:from:" \
    "--agent[Target agent (default: configured default agent)]:agent:" \
    "--include-secrets[Import supported credentials and secrets]" \
    "--no-auth-credentials[Skip auth credential migration]" \
    "--overwrite[Overwrite conflicting target files after item-level backups]" \
    "--dry-run[Preview only; do not apply changes]" \
    "--yes[Apply without prompting after preview]" \
    "--skill[Select one skill to migrate by name or item id; repeat for multiple skills]:skill:" \
    "--plugin[Select one Codex plugin to migrate by name or item id; repeat for multiple plugins]:plugin:" \
    "--item[Select one exact migration item id; repeat for multiple items]:item:" \
    "--backup-output[Pre-migration backup archive path or directory]:backupOutput:" \
    "--no-backup[Skip the pre-migration OpenClaw backup]" \
    "--force[Allow dangerous options such as --no-backup]" \
    "--json[Output JSON]" \
    "--verify-plugin-apps[Codex only: verify source plugin app accessibility with app/installed before planning native plugin activation]" \
    "1: :_values 'command' 'apply[Apply a migration after a verified backup]' 'list[List migration providers]' 'plan[Preview a migration without changing OpenClaw state]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_migrate_list ;;
        (plan) _openclaw_migrate_plan ;;
        (apply) _openclaw_migrate_apply ;;
      esac
      ;;
  esac
}

_openclaw_doctor() {
  _arguments -C \
    "--no-workspace-suggestions[Disable workspace memory system suggestions]" \
    "--yes[Accept defaults without prompting]" \
    "--repair[Apply recommended repairs without prompting]" \
    "--fix[Apply recommended repairs (alias for --repair)]" \
    "--force[Allow aggressive repair choices (with --fix, preserves service definitions)]" \
    "--non-interactive[Run without prompts (safe migrations only)]" \
    "--generate-gateway-token[Generate and configure a gateway token]" \
    "--allow-exec[Allow doctor to execute exec SecretRefs while verifying configured secrets]" \
    "--deep[Scan system services for extra gateway installs]" \
    "--lint[Run read-only health checks and report findings]" \
    "--post-upgrade[Emit plugin-compat findings only (machine-readable with --json)]" \
    "--session-sqlite[Run session SQLite migration mode (dry-run|import|validate|inspect|compact|restore|recover)]:sessionSqlite:" \
    "--state-sqlite[Run shared state SQLite maintenance mode (compact)]:stateSqlite:" \
    "--session-sqlite-store[With --session-sqlite: inspect one session store]:sessionSqliteStore:" \
    "--session-sqlite-agent[With --session-sqlite: inspect one agent]:sessionSqliteAgent:" \
    "--session-sqlite-all-agents[With --session-sqlite: inspect configured and discovered agent stores]" \
    "--github-issue[With --session-sqlite recover: prepare and optionally create an openclaw/openclaw issue]" \
    "--json[Emit JSON; bare --json runs advisory read-only health checks]" \
    "--severity-min[With --lint: drop findings below this severity (info|warning|error)]:severityMin:" \
    "--all[With --lint: run all registered checks, including opt-in checks]" \
    "--skip[With --lint: skip a specific check id (repeatable)]:skip:" \
    "--only[With --lint: run only the specified check id (repeatable)]:only:"
}

_openclaw_triage() {
  _arguments -C \
    "--json[Output sanitized handoff paths, finding counts, and commands as JSON]" \
    "--no-export[Skip the sanitized diagnostics archive]" \
    "--agent[Select a coding agent (claude|codex|opencode|pi)]:agent:" \
    "--run[Run one embedded agent turn after verifying model inference]" \
    "--non-interactive[Prepare diagnostics without prompting or starting an agent]" \
    "--update-result[Include update-failure diagnostics from this JSON artifact]:updateResult:"
}

_openclaw_dashboard() {
  _arguments -C \
    "--no-open[Print URL but do not launch a browser]" \
    "--json[Output dashboard connection details as JSON]" \
    "--yes[Start/install the gateway without prompting when needed]"
}

_openclaw_reset() {
  _arguments -C \
    "--scope[config|config+creds+sessions|full (default: interactive prompt)]:scope:" \
    "--yes[Skip confirmation prompts]" \
    "--non-interactive[Disable prompts (requires --scope + --yes)]" \
    "--dry-run[Print actions without removing files]"
}

_openclaw_uninstall() {
  _arguments -C \
    "--service[Remove the gateway service]" \
    "--state[Remove state + config]" \
    "--workspace[Remove workspace dirs]" \
    "--app[Remove the macOS app]" \
    "--all[Remove service + state + workspace + app]" \
    "--yes[Skip confirmation prompts]" \
    "--non-interactive[Disable prompts (requires --yes)]" \
    "--dry-run[Print actions without removing files]"
}

_openclaw_message_send() {
  _arguments -C \
    "(--message -m)"{--message,-m}"[Message body (required unless --media or --presentation is set)]:message:" \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--media[Attach media (image/audio/video/document). Accepts local paths or URLs.]:media:" \
    "--presentation[Shared presentation payload as JSON (text, context, dividers, charts, tables, buttons, selects)]:presentation:" \
    "--delivery[Shared delivery preferences as JSON]:delivery:" \
    "--pin[Request that the delivered message be pinned when supported]" \
    "--reply-to[Reply-to message id]:replyTo:" \
    "--thread-id[Thread id (Telegram forum thread)]:threadId:" \
    "--gif-playback[Treat video media as GIF playback (WhatsApp only).]" \
    "--force-document[Preserve original image bytes on Slack, or send images, GIFs, and videos as documents on Telegram and WhatsApp, to avoid channel compression.]" \
    "--silent[Send message silently without notification (Telegram + Discord)]" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_broadcast() {
  _arguments -C \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--targets[Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.]:targets:" \
    "--message[Message to send]:message:" \
    "--media[Media URL]:media:"
}

_openclaw_message_poll() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--poll-question[Poll question]:pollQuestion:" \
    "--poll-option[Poll option (repeat 2-12 times)]:pollOption:" \
    "--poll-multi[Allow multiple selections]" \
    "--poll-duration-hours[Poll duration in hours (Discord)]:pollDurationHours:" \
    "--poll-duration-seconds[Poll duration in seconds (Telegram; 5-604800)]:pollDurationSeconds:" \
    "--poll-anonymous[Send an anonymous poll (Telegram)]" \
    "--poll-public[Send a non-anonymous poll (Telegram)]" \
    "(--message -m)"{--message,-m}"[Optional message body]:message:" \
    "--silent[Send poll silently without notification (Telegram + Discord where supported)]" \
    "--thread-id[Thread id (Telegram forum topic / Slack thread ts)]:threadId:"
}

_openclaw_message_react() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--message-id[Message id]:messageId:" \
    "--emoji[Emoji for reactions]:emoji:" \
    "--remove[Remove reaction]" \
    "--participant[WhatsApp reaction participant]:participant:" \
    "--from-me[WhatsApp reaction fromMe]" \
    "--target-author[Signal reaction target author (uuid or phone)]:targetAuthor:" \
    "--target-author-uuid[Signal reaction target author uuid]:targetAuthorUuid:"
}

_openclaw_message_reactions() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--message-id[Message id]:messageId:" \
    "--limit[Result limit]:limit:"
}

_openclaw_message_read() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--limit[Result limit]:limit:" \
    "--message-id[Read a specific message id]:messageId:" \
    "--before[Read/search before id]:before:" \
    "--after[Read/search after id]:after:" \
    "--around[Read around id]:around:" \
    "--thread-id[Thread id (Slack thread timestamp)]:threadId:" \
    "!--include-thread[]"
}

_openclaw_message_edit() {
  _arguments -C \
    "--message-id[Message id]:messageId:" \
    "(--message -m)"{--message,-m}"[Message body]:message:" \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--thread-id[Thread id (Telegram forum thread)]:threadId:"
}

_openclaw_message_delete() {
  _arguments -C \
    "--message-id[Message id]:messageId:" \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_pin() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--message-id[Message id]:messageId:"
}

_openclaw_message_unpin() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--message-id[Message id (or pinned message resource id for MSTeams)]:messageId:" \
    "--pinned-message-id[Pinned message resource id (MSTeams: from pin or list-pins, not the chat message id)]:pinnedMessageId:"
}

_openclaw_message_pins() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--limit[Result limit]:limit:"
}

_openclaw_message_permissions() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_search() {
  _arguments -C \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--guild-id[Guild id]:guildId:" \
    "--query[Search query]:query:" \
    "--channel-id[Channel id]:channelId:" \
    "--channel-ids[Channel id (repeat)]:channelIds:" \
    "--author-id[Author id]:authorId:" \
    "--author-ids[Author id (repeat)]:authorIds:" \
    "--limit[Result limit]:limit:"
}

_openclaw_message_thread_create() {
  _arguments -C \
    "--thread-name[Thread name]:threadName:" \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--message-id[Message id (optional)]:messageId:" \
    "(--message -m)"{--message,-m}"[Initial thread message text]:message:" \
    "--auto-archive-min[Thread auto-archive minutes]:autoArchiveMin:"
}

_openclaw_message_thread_list() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--channel-id[Channel id]:channelId:" \
    "--include-archived[Include archived threads]" \
    "--before[Read/search before id]:before:" \
    "--limit[Result limit]:limit:"
}

_openclaw_message_thread_reply() {
  _arguments -C \
    "(--message -m)"{--message,-m}"[Message body]:message:" \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--media[Attach media (image/audio/video/document). Accepts local paths or URLs.]:media:" \
    "--reply-to[Reply-to message id]:replyTo:"
}

_openclaw_message_thread() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'create[Create a thread]' 'list[List threads]' 'reply[Reply in a thread]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (create) _openclaw_message_thread_create ;;
        (list) _openclaw_message_thread_list ;;
        (reply) _openclaw_message_thread_reply ;;
      esac
      ;;
  esac
}

_openclaw_message_emoji_list() {
  _arguments -C \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--guild-id[Guild id (Discord)]:guildId:"
}

_openclaw_message_emoji_upload() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--emoji-name[Emoji name]:emojiName:" \
    "--media[Emoji media (path or URL)]:media:" \
    "--role-ids[Role id (repeat)]:roleIds:"
}

_openclaw_message_emoji() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'list[List emojis]' 'upload[Upload an emoji]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_message_emoji_list ;;
        (upload) _openclaw_message_emoji_upload ;;
      esac
      ;;
  esac
}

_openclaw_message_sticker_send() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--sticker-id[Sticker id (repeat)]:stickerId:" \
    "(--message -m)"{--message,-m}"[Optional message body]:message:"
}

_openclaw_message_sticker_upload() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--sticker-name[Sticker name]:stickerName:" \
    "--sticker-desc[Sticker description]:stickerDesc:" \
    "--sticker-tags[Sticker tags]:stickerTags:" \
    "--media[Sticker media (path or URL)]:media:"
}

_openclaw_message_sticker() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'send[Send stickers]' 'upload[Upload a sticker]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (send) _openclaw_message_sticker_send ;;
        (upload) _openclaw_message_sticker_upload ;;
      esac
      ;;
  esac
}

_openclaw_message_role_info() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_role_add() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--user-id[User id]:userId:" \
    "--role-id[Role id]:roleId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_role_remove() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--user-id[User id]:userId:" \
    "--role-id[Role id]:roleId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_role() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add role to a member]' 'info[List roles]' 'remove[Remove role from a member]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (info) _openclaw_message_role_info ;;
        (add) _openclaw_message_role_add ;;
        (remove) _openclaw_message_role_remove ;;
      esac
      ;;
  esac
}

_openclaw_message_channel_info() {
  _arguments -C \
    "(--target -t)"{--target,-t}"[Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id]:target:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_channel_list() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_channel() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'info[Fetch channel info]' 'list[List channels]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (info) _openclaw_message_channel_info ;;
        (list) _openclaw_message_channel_list ;;
      esac
      ;;
  esac
}

_openclaw_message_member_info() {
  _arguments -C \
    "--user-id[User id]:userId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--guild-id[Guild id (Discord)]:guildId:"
}

_openclaw_message_member() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'info[Fetch member info]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (info) _openclaw_message_member_info ;;
      esac
      ;;
  esac
}

_openclaw_message_voice_status() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--user-id[User id]:userId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_voice() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'status[Fetch voice status]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (status) _openclaw_message_voice_status ;;
      esac
      ;;
  esac
}

_openclaw_message_event_list() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]"
}

_openclaw_message_event_create() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--event-name[Event name]:eventName:" \
    "--start-time[Event start time]:startTime:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--end-time[Event end time]:endTime:" \
    "--desc[Event description]:desc:" \
    "--channel-id[Channel id]:channelId:" \
    "--location[Event location]:location:" \
    "--event-type[Event type]:eventType:" \
    "--image[Cover image URL or local file path]:image:"
}

_openclaw_message_event() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'create[Create a scheduled event]' 'list[List scheduled events]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_message_event_list ;;
        (create) _openclaw_message_event_create ;;
      esac
      ;;
  esac
}

_openclaw_message_timeout() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--user-id[User id]:userId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--duration-min[Timeout duration minutes]:durationMin:" \
    "--until[Timeout until]:until:" \
    "--reason[Moderation reason]:reason:"
}

_openclaw_message_kick() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--user-id[User id]:userId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--reason[Moderation reason]:reason:"
}

_openclaw_message_ban() {
  _arguments -C \
    "--guild-id[Guild id]:guildId:" \
    "--user-id[User id]:userId:" \
    "--channel[Channel: telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch]:channel:" \
    "--account[Channel account id (accountId)]:account:" \
    "--json[Output result as JSON]" \
    "--dry-run[Print payload and skip sending]" \
    "--verbose[Verbose logging]" \
    "--reason[Moderation reason]:reason:" \
    "--delete-days[Ban delete message days]:deleteDays:"
}

_openclaw_message() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'ban[Ban a member]' 'broadcast[Broadcast a message to multiple targets]' 'channel[Channel actions]' 'delete[Delete a message]' 'edit[Edit a message]' 'emoji[Emoji actions]' 'event[Event actions]' 'kick[Kick a member]' 'member[Member actions]' 'permissions[Fetch channel permissions]' 'pin[Pin a message]' 'pins[List pinned messages]' 'poll[Send a poll]' 'react[Add or remove a reaction]' 'reactions[List reactions on a message]' 'read[Read recent messages]' 'role[Role actions]' 'search[Search Discord messages]' 'send[Send a message]' 'sticker[Sticker actions]' 'thread[Thread actions]' 'timeout[Timeout a member]' 'unpin[Unpin a message]' 'voice[Voice actions]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (send) _openclaw_message_send ;;
        (broadcast) _openclaw_message_broadcast ;;
        (poll) _openclaw_message_poll ;;
        (react) _openclaw_message_react ;;
        (reactions) _openclaw_message_reactions ;;
        (read) _openclaw_message_read ;;
        (edit) _openclaw_message_edit ;;
        (delete) _openclaw_message_delete ;;
        (pin) _openclaw_message_pin ;;
        (unpin) _openclaw_message_unpin ;;
        (pins) _openclaw_message_pins ;;
        (permissions) _openclaw_message_permissions ;;
        (search) _openclaw_message_search ;;
        (thread) _openclaw_message_thread ;;
        (emoji) _openclaw_message_emoji ;;
        (sticker) _openclaw_message_sticker ;;
        (role) _openclaw_message_role ;;
        (channel) _openclaw_message_channel ;;
        (member) _openclaw_message_member ;;
        (voice) _openclaw_message_voice ;;
        (event) _openclaw_message_event ;;
        (timeout) _openclaw_message_timeout ;;
        (kick) _openclaw_message_kick ;;
        (ban) _openclaw_message_ban ;;
      esac
      ;;
  esac
}

_openclaw_mcp_serve() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--token-file[Read gateway token from file]:tokenFile:" \
    "--password[Gateway password (if required)]:password:" \
    "--password-file[Read gateway password from file]:passwordFile:" \
    "--claude-channel-mode[Claude channel notification mode: auto, on, or off]:claudeChannelMode:" \
    "(--verbose -v)"{--verbose,-v}"[Verbose logging to stderr]"
}

_openclaw_mcp_list() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_mcp_show() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_mcp_status() {
  _arguments -C \
    "(--verbose -v)"{--verbose,-v}"[Show transport, auth, timeout, and filter details]" \
    "--json[Print JSON]"
}

_openclaw_mcp_probe() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_mcp_doctor() {
  _arguments -C \
    "--probe[Also connect to each checked server]" \
    "--json[Print JSON]"
}

_openclaw_mcp_add() {
  _arguments -C \
    "--command[Stdio command to spawn]:command:" \
    "--arg[Repeatable stdio argument]:arg:" \
    "--env[Repeatable stdio environment entry]:env:" \
    "--cwd[Working directory for stdio server]:cwd:" \
    "--url[HTTP MCP server URL]:url:" \
    "--transport[HTTP transport: streamable-http or sse]:transport:" \
    "--header[Repeatable HTTP header]:header:" \
    "--auth[HTTP auth mode: oauth]:auth:" \
    "--oauth-scope[OAuth scope]:oauthScope:" \
    "--oauth-redirect-url[OAuth redirect URL]:oauthRedirectUrl:" \
    "--oauth-client-metadata-url[OAuth client metadata URL]:oauthClientMetadataUrl:" \
    "--include[Comma-separated MCP tool names or '*' globs to expose]:include:" \
    "--exclude[Comma-separated MCP tool names or '*' globs to hide]:exclude:" \
    "--timeout[Per-request timeout in seconds]:timeout:" \
    "--connect-timeout[Connection timeout in seconds]:connectTimeout:" \
    "--parallel[Mark this server safe for concurrent tool calls]" \
    "--approval[Codex MCP tool approval mode: auto, prompt, or approve]:approval:" \
    "--disabled[Save the server disabled]" \
    "--ssl-verify[Verify HTTPS certificates: true or false]:sslVerify:" \
    "--client-cert[HTTP mutual TLS client certificate path]:clientCert:" \
    "--client-key[HTTP mutual TLS client key path]:clientKey:" \
    "--no-probe[Save without connecting first]"
}

_openclaw_mcp_set() {
  _arguments -C \
    
}

_openclaw_mcp_tools() {
  _arguments -C \
    "--include[Comma-separated MCP tool names or '*' globs to expose]:include:" \
    "--exclude[Comma-separated MCP tool names or '*' globs to hide]:exclude:" \
    "--clear[Clear this server's MCP tool filter]"
}

_openclaw_mcp_configure() {
  _arguments -C \
    "--enable[Enable this saved server]" \
    "--disable[Disable this saved server]" \
    "--include[Comma-separated MCP tool names or '*' globs to expose]:include:" \
    "--exclude[Comma-separated MCP tool names or '*' globs to hide]:exclude:" \
    "--clear-tools[Clear this server's MCP tool filter]" \
    "--timeout[Per-request timeout in seconds]:timeout:" \
    "--connect-timeout[Connection timeout in seconds]:connectTimeout:" \
    "--clear-timeouts[Clear request and connection timeout overrides]" \
    "--parallel[Mark this server safe for concurrent tool calls]" \
    "--no-parallel[Clear the concurrent tool-call marker]" \
    "--approval[Codex MCP tool approval mode: auto, prompt, or approve]:approval:" \
    "--auth[HTTP auth mode: oauth]:auth:" \
    "--clear-auth[Clear auth and OAuth metadata]" \
    "--oauth-scope[OAuth scope]:oauthScope:" \
    "--oauth-redirect-url[OAuth redirect URL]:oauthRedirectUrl:" \
    "--oauth-client-metadata-url[OAuth client metadata URL]:oauthClientMetadataUrl:" \
    "--ssl-verify[Verify HTTPS certificates: true or false]:sslVerify:" \
    "--client-cert[HTTP mutual TLS client certificate path]:clientCert:" \
    "--client-key[HTTP mutual TLS client key path]:clientKey:" \
    "--clear-tls[Clear TLS verification and mTLS overrides]" \
    "--probe[Probe the updated server before saving]"
}

_openclaw_mcp_login() {
  _arguments -C \
    "--code[Authorization code from the OAuth redirect]:code:"
}

_openclaw_mcp_logout() {
  _arguments -C \
    
}

_openclaw_mcp_reload() {
  _arguments -C \
    
}

_openclaw_mcp_unset() {
  _arguments -C \
    
}

_openclaw_mcp() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add one MCP server from flags and probe it before saving]' 'configure[Update MCP server operator controls without replacing the server]' 'doctor[Check configured MCP servers for static setup problems]' 'list[List OpenClaw-managed MCP servers from mcp.servers]' 'login[Authorize an OAuth MCP server]' 'logout[Clear stored OAuth credentials for an MCP server]' 'probe[Connect to configured MCP servers and list available capabilities]' 'reload[Dispose cached MCP runtimes so new config is used on the next turn]' 'serve[Expose OpenClaw channels over MCP stdio]' 'set[Set one OpenClaw-managed MCP server from a JSON object]' 'show[Show one OpenClaw-managed MCP server or the full mcp.servers config]' 'status[Show configured MCP server transport status without connecting]' 'tools[Update per-server MCP tool include/exclude filters]' 'unset[Remove one OpenClaw-managed MCP server]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (serve) _openclaw_mcp_serve ;;
        (list) _openclaw_mcp_list ;;
        (show) _openclaw_mcp_show ;;
        (status) _openclaw_mcp_status ;;
        (probe) _openclaw_mcp_probe ;;
        (doctor) _openclaw_mcp_doctor ;;
        (add) _openclaw_mcp_add ;;
        (set) _openclaw_mcp_set ;;
        (tools) _openclaw_mcp_tools ;;
        (configure) _openclaw_mcp_configure ;;
        (login) _openclaw_mcp_login ;;
        (logout) _openclaw_mcp_logout ;;
        (reload) _openclaw_mcp_reload ;;
        (unset) _openclaw_mcp_unset ;;
      esac
      ;;
  esac
}

_openclaw_transcripts_list() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_transcripts_show() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_transcripts_path() {
  _arguments -C \
    "--dir[Materialize all artifacts and print the session directory]" \
    "--metadata[Materialize and print metadata.json]" \
    "--transcript[Materialize and print transcript.jsonl]" \
    "--json[Print JSON]"
}

_openclaw_transcripts() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'list[List stored transcript sessions]' 'path[Materialize and print a stored transcripts artifact path]' 'show[Print and materialize a transcript summary]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_transcripts_list ;;
        (show) _openclaw_transcripts_show ;;
        (path) _openclaw_transcripts_path ;;
      esac
      ;;
  esac
}

_openclaw_agent_exec() {
  _arguments -C \
    "--message-file[Read the UTF-8 prompt from a file; use - for stdin]:messageFile:" \
    "--cwd[Set both the agent workspace and tool working directory]:cwd:" \
    "--state-dir[Use an existing state directory without deleting it]:stateDir:" \
    "--config[Run against this config file instead of the ambient config (pins a reproducible run)]:config:" \
    "--isolated[Ignore the ambient config and run against exec defaults only]" \
    "--model[Use an explicit primary model for this run]:model:" \
    "--code-mode[Tool mode: direct | auto | code]:codeMode:" \
    "--local-model-lean[Use the reduced local-model tool surface]" \
    "--thinking[Thinking level: off | minimal | low | medium | high | xhigh | adaptive | max | ultra where supported]:thinking:" \
    "--fallback[Add an ordered fallback model (repeatable; requires --model)]:fallback:" \
    "--auth-env-only[Use provider credentials from environment variables only]" \
    "--no-auth-env-only[Allow stored and external CLI credential discovery]" \
    "--timeout[Agent deadline in seconds]:timeout:" \
    "--json[Emit the stable agent-exec JSON envelope]"
}

_openclaw_agent() {
  local -a commands
  local -a options
  
  _arguments -C \
    "(--message -m)"{--message,-m}"[Message body for the agent]:message:" \
    "--message-file[Read the agent message body from a UTF-8 file (max 4 MiB)]:messageFile:" \
    "(--to -t)"{--to,-t}"[Recipient number in E.164 used to derive the session key]:to:" \
    "--session-key[Explicit session key (agent:<id>:<key>, or scoped to --agent)]:sessionKey:" \
    "--session-id[Use an explicit session id]:sessionId:" \
    "--agent[Agent id (overrides routing bindings)]:agent:" \
    "--model[Model override for this run (provider/model or model id)]:model:" \
    "--thinking[Thinking level: off | minimal | low | medium | high | xhigh | adaptive | max | ultra where supported]:thinking:" \
    "--verbose[Persist agent verbose level for the session]:verbose:" \
    "--channel[Delivery channel: last|telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch (omit to use the main session channel)]:channel:" \
    "--reply-to[Delivery target override (separate from session routing)]:replyTo:" \
    "--reply-channel[Delivery channel override (separate from routing)]:replyChannel:" \
    "--reply-account[Delivery account id override]:replyAccount:" \
    "--local[Run the embedded agent locally using configured provider credentials or local CLI logins]" \
    "--deliver[Send the agent's reply back to the selected channel]" \
    "--json[Output result as JSON]" \
    "--timeout[Override agent command timeout (seconds, default 600 or config value)]:timeout:" \
    "1: :_values 'command' 'exec[Run one isolated headless embedded agent turn]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (exec) _openclaw_agent_exec ;;
      esac
      ;;
  esac
}

_openclaw_agents_list() {
  _arguments -C \
    "--json[Output JSON instead of text]" \
    "--bindings[Include routing bindings]" \
    "--tree[Render agent creation hierarchy]"
}

_openclaw_agents_bindings() {
  _arguments -C \
    "--agent[Filter by agent id]:agent:" \
    "--json[Output JSON instead of text]"
}

_openclaw_agents_bind() {
  _arguments -C \
    "--agent[Agent id (defaults to current default agent)]:agent:" \
    "--bind[Binding to add (repeatable). If omitted, accountId is resolved by channel defaults/hooks.]::bind:" \
    "--json[Output JSON summary]"
}

_openclaw_agents_unbind() {
  _arguments -C \
    "--agent[Agent id (defaults to current default agent)]:agent:" \
    "--bind[Binding to remove (repeatable)]::bind:" \
    "--all[Remove all bindings for this agent]" \
    "--json[Output JSON summary]"
}

_openclaw_agents_add() {
  _arguments -C \
    "--workspace[Workspace directory for the new agent]:workspace:" \
    "--model[Model id for this agent]:model:" \
    "--agent-dir[Agent state directory for this agent]:agentDir:" \
    "--bind[Route channel binding (repeatable)]::bind:" \
    "--non-interactive[Disable prompts; requires --workspace]" \
    "--json[Output JSON summary]"
}

_openclaw_agents_set_identity() {
  _arguments -C \
    "--agent[Agent id to update]:agent:" \
    "--workspace[Locate the agent and IDENTITY.md; does not change the stored workspace]:workspace:" \
    "--identity-file[Explicit IDENTITY.md path to read]:identityFile:" \
    "--from-identity[Read values from IDENTITY.md]" \
    "--name[Identity name]:name:" \
    "--theme[Identity theme]:theme:" \
    "--emoji[Identity emoji]:emoji:" \
    "--avatar[Identity avatar (workspace path, http(s) URL, or data URI)]:avatar:" \
    "--json[Output JSON summary]"
}

_openclaw_agents_delete() {
  _arguments -C \
    "--force[Skip confirmation]" \
    "--json[Output JSON summary]"
}

_openclaw_agents() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add a new isolated agent]' 'bind[Add routing bindings for an agent]' 'bindings[List routing bindings]' 'delete[Delete an agent and prune workspace/state]' 'list[List configured agents]' 'set-identity[Update an agent identity (name/theme/emoji/avatar)]' 'unbind[Remove routing bindings for an agent]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_agents_list ;;
        (bindings) _openclaw_agents_bindings ;;
        (bind) _openclaw_agents_bind ;;
        (unbind) _openclaw_agents_unbind ;;
        (add) _openclaw_agents_add ;;
        (set-identity) _openclaw_agents_set_identity ;;
        (delete) _openclaw_agents_delete ;;
      esac
      ;;
  esac
}

_openclaw_audit() {
  _arguments -C \
    "--agent[Filter by agent id]:agent:" \
    "--session[Filter by exact session key]:session:" \
    "--run[Filter by run id]:run:" \
    "--execution[Inspect one exact execution id]:execution:" \
    "--kind[Filter by kind (agent_run, tool_action, or message)]:kind:" \
    "--status[Filter by status (started, succeeded, failed, cancelled, timed_out, blocked, or unknown)]:status:" \
    "--direction[Filter message direction (inbound or outbound)]:direction:" \
    "--channel[Filter message channel]:channel:" \
    "--after[Include records at/after ISO time or Unix milliseconds]:after:" \
    "--before[Include records at/before ISO time or Unix milliseconds]:before:" \
    "--cursor[Continue from a previous result cursor]:cursor:" \
    "--limit[Maximum records (1-500; decisions 1-100)]:limit:" \
    "--explain[Inspect execution identity and run-admission reasoning]" \
    "--json[Output a bounded JSON page]"
}

_openclaw_status() {
  _arguments -C \
    "--json[Output JSON instead of text]" \
    "--all[Full diagnosis (read-only, pasteable)]" \
    "--usage[Show model provider usage/quota snapshots]" \
    "--agent[Agent id for --usage auth scope]:agent:" \
    "--deep[Probe channels (WhatsApp Web + Telegram + Discord + Slack + Signal)]" \
    "--timeout[Probe timeout in milliseconds]:timeout:" \
    "--verbose[Verbose logging]" \
    "--debug[Alias for --verbose]"
}

_openclaw_health() {
  _arguments -C \
    "--json[Output JSON instead of text]" \
    "--timeout[Connection timeout in milliseconds]:timeout:" \
    "--verbose[Verbose logging]" \
    "--debug[Alias for --verbose]"
}

_openclaw_sessions_list() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--verbose[Verbose logging]" \
    "--store[Legacy session store selector path]:store:" \
    "--agent[Agent id to inspect (required for multiple explicit agents)]:agent:" \
    "--all-agents[Aggregate sessions across all configured agents]" \
    "--active[Only show sessions updated within the past N minutes]:active:" \
    "--limit[Max sessions to show (default: 100; use \"all\" for full output)]:limit:"
}

_openclaw_sessions_cleanup() {
  _arguments -C \
    "--store[Legacy session store selector path]:store:" \
    "--agent[Agent id to maintain (required for multiple explicit agents)]:agent:" \
    "--all-agents[Run maintenance across all configured agents]" \
    "--dry-run[Preview maintenance actions without writing]" \
    "--enforce[Apply maintenance even when configured mode is warn]" \
    "--fix-missing[Remove store entries whose transcript files are missing (bypasses age/count retention)]" \
    "--fix-dm-scope[Retire stale direct-DM session rows that no longer match session.dmScope=main]" \
    "--active-key[Protect this session key from budget-eviction]:activeKey:" \
    "--json[Output JSON]"
}

_openclaw_sessions_tail() {
  _arguments -C \
    "--session-key[Session key to tail (default: active sessions or latest)]:sessionKey:" \
    "--tail[Number of existing trajectory events to show]:tail:" \
    "--follow[Continue following for new trajectory events]" \
    "--store[Legacy session store selector path]:store:" \
    "--agent[Agent id to inspect (required for multiple explicit agents)]:agent:" \
    "--all-agents[Aggregate sessions across all configured agents]"
}

_openclaw_sessions_export_trajectory() {
  _arguments -C \
    "--session-key[Session key to export]:sessionKey:" \
    "--output[Output directory name inside .openclaw/trajectory-exports]:output:" \
    "--workspace[Workspace root for the export (default: current directory)]:workspace:" \
    "--store[Legacy session store selector path]:store:" \
    "--agent[Agent id for resolving the default session store]:agent:" \
    "--request-json-base64[Base64url-encoded export request]:requestJsonBase64:" \
    "--json[Output JSON]"
}

_openclaw_sessions_archive() {
  _arguments -C \
    "--dry-run[Preview archive actions without writing]" \
    "--agent[Agent id that owns the session (required for global keys)]:agent:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[RPC timeout in milliseconds]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_sessions_delete() {
  _arguments -C \
    "--dry-run[Preview delete actions without writing]" \
    "--yes[Skip the destructive confirmation prompt]" \
    "--agent[Agent id that owns the session (required for global keys)]:agent:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[RPC timeout in milliseconds]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_sessions_compact() {
  _arguments -C \
    "--agent[Agent id that owns the session (required for global keys)]:agent:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[RPC timeout in milliseconds]:timeout:" \
    "--json[Output JSON]" \
    "--max-lines[Truncate to the last N transcript lines instead of LLM summarization]:maxLines:"
}

_openclaw_sessions() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output as JSON]" \
    "--verbose[Verbose logging]" \
    "--store[Legacy session store selector path]:store:" \
    "--agent[Agent id to inspect (required for multiple explicit agents)]:agent:" \
    "--all-agents[Aggregate sessions across all configured agents]" \
    "--active[Only show sessions updated within the past N minutes]:active:" \
    "--limit[Max sessions to show (default: 100; use \"all\" for full output)]:limit:" \
    "1: :_values 'command' 'archive[Archive stored sessions via the running gateway]' 'cleanup[Run session-store maintenance now]' 'compact[Compact a stored session transcript via the running gateway]' 'delete[Delete stored sessions and their live artifacts via the running gateway]' 'export-trajectory[Export a redacted trajectory bundle for a stored session]' 'list[List stored conversation sessions]' 'tail[Tail human-readable session trajectory progress]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_sessions_list ;;
        (cleanup) _openclaw_sessions_cleanup ;;
        (tail) _openclaw_sessions_tail ;;
        (export-trajectory) _openclaw_sessions_export_trajectory ;;
        (archive) _openclaw_sessions_archive ;;
        (delete) _openclaw_sessions_delete ;;
        (compact) _openclaw_sessions_compact ;;
      esac
      ;;
  esac
}

_openclaw_tasks_list() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--runtime[Filter by kind (subagent, acp, cron, cli)]:runtime:" \
    "--status[Filter by status (queued, running, succeeded, failed, timed_out, cancelled, lost, blocked)]:status:"
}

_openclaw_tasks_audit() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--severity[Filter by severity (warn, error)]:severity:" \
    "--code[Filter by finding code (stale_queued, stale_running, lost, delivery_failed, missing_cleanup, inconsistent_timestamps, restore_failed, stale_waiting, stale_blocked, cancel_stuck, missing_linked_tasks, blocked_task_missing)]:code:" \
    "--limit[Limit displayed findings]:limit:"
}

_openclaw_tasks_maintenance() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--apply[Apply reconciliation, cleanup stamping, and pruning]"
}

_openclaw_tasks_show() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_tasks_notify() {
  _arguments -C \
    
}

_openclaw_tasks_cancel() {
  _arguments -C \
    
}

_openclaw_tasks_retry() {
  _arguments -C \
    
}

_openclaw_tasks_dismiss() {
  _arguments -C \
    
}

_openclaw_tasks_flow_list() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--status[Filter by status (queued, running, waiting, blocked, succeeded, failed, cancelled, lost)]:status:"
}

_openclaw_tasks_flow_show() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_tasks_flow_cancel() {
  _arguments -C \
    
}

_openclaw_tasks_flow() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output as JSON]" \
    "1: :_values 'command' 'cancel[Cancel a running TaskFlow]' 'list[List tracked TaskFlows]' 'show[Show one TaskFlow by flow id or owner key]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_tasks_flow_list ;;
        (show) _openclaw_tasks_flow_show ;;
        (cancel) _openclaw_tasks_flow_cancel ;;
      esac
      ;;
  esac
}

_openclaw_tasks() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output as JSON]" \
    "--runtime[Filter by kind (subagent, acp, cron, cli)]:runtime:" \
    "--status[Filter by status (queued, running, succeeded, failed, timed_out, cancelled, lost, blocked)]:status:" \
    "1: :_values 'command' 'audit[Show stale or broken background tasks and TaskFlows]' 'cancel[Cancel a running background task]' 'dismiss[Dismiss delivery for up to 10 blocked subagent completions]' 'flow[Inspect durable TaskFlow state under tasks]' 'list[List tracked background tasks]' 'maintenance[Preview or apply tasks and TaskFlow maintenance]' 'notify[Set task notify policy]' 'retry[Retry delivery for up to 10 blocked subagent completions]' 'show[Show one background task by task id, run id, or session key]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_tasks_list ;;
        (audit) _openclaw_tasks_audit ;;
        (maintenance) _openclaw_tasks_maintenance ;;
        (show) _openclaw_tasks_show ;;
        (notify) _openclaw_tasks_notify ;;
        (cancel) _openclaw_tasks_cancel ;;
        (retry) _openclaw_tasks_retry ;;
        (dismiss) _openclaw_tasks_dismiss ;;
        (flow) _openclaw_tasks_flow ;;
      esac
      ;;
  esac
}

_openclaw_acp_client() {
  _arguments -C \
    "--cwd[Working directory for the ACP session]:cwd:" \
    "--server[ACP server command (default: openclaw)]:server:" \
    "--server-args[Extra arguments for the ACP server]:serverArgs:" \
    "--server-verbose[Enable verbose logging on the ACP server]" \
    "(--verbose -v)"{--verbose,-v}"[Verbose client logging]"
}

_openclaw_acp() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--token-file[Read gateway token from file]:tokenFile:" \
    "--password[Gateway password (if required)]:password:" \
    "--password-file[Read gateway password from file]:passwordFile:" \
    "--session[Default session key (e.g. agent:main:main)]:session:" \
    "--session-label[Default session label to resolve]:sessionLabel:" \
    "--require-existing[Fail if the session key/label does not exist]" \
    "--reset-session[Reset the session key before first use]" \
    "--no-prefix-cwd[Do not prefix prompts with the working directory]" \
    "--provenance[ACP provenance mode: off, meta, or meta+receipt]:provenance:" \
    "(--verbose -v)"{--verbose,-v}"[Verbose logging to stderr]" \
    "1: :_values 'command' 'client[Run an interactive ACP client against the local ACP bridge]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (client) _openclaw_acp_client ;;
      esac
      ;;
  esac
}

_openclaw_gateway_run() {
  _arguments -C \
    "--port[Port for the gateway WebSocket]:port:" \
    "--bind[Bind mode (\"loopback\"|\"lan\"|\"tailnet\"|\"auto\"|\"custom\"). Defaults to config gateway.bind (or loopback).]:bind:" \
    "--token[Shared token required in connect.params.auth.token (default: OPENCLAW_GATEWAY_TOKEN env if set)]:token:" \
    "--auth[Gateway auth mode (\"none\"|\"token\"|\"password\"|\"trusted-proxy\")]:auth:" \
    "--password[Password for auth mode=password]:password:" \
    "--password-file[Read gateway password from file]:passwordFile:" \
    "--tailscale[Tailscale exposure mode (\"off\"|\"serve\"|\"funnel\")]:tailscale:" \
    "!--tailscale-reset-on-exit[]" \
    "--allow-unconfigured[Allow gateway start without enforcing gateway.mode=local in config (does not repair config)]" \
    "--dev[Create a dev config + workspace if missing (no BOOTSTRAP.md)]" \
    "--ambient-channels[Allow the gateway to auto-configure channels from ambient environment variables]" \
    "--dev-ambient-channels[Deprecated alias for --ambient-channels]" \
    "--reset[Reset dev config + credentials + sessions + workspace (requires --dev)]" \
    "!--task-supervisor[]" \
    "--force[Kill any existing listener on the target port before starting]" \
    "--verbose[Verbose logging to stdout/stderr]" \
    "--cli-backend-logs[Only show CLI backend logs in the console (includes stdout/stderr)]" \
    "--claude-cli-logs[Deprecated alias for --cli-backend-logs]" \
    "--ws-log[WebSocket log style (\"auto\"|\"full\"|\"compact\")]:wsLog:" \
    "--compact[Alias for \"--ws-log compact\"]" \
    "--raw-stream[Log raw model stream events to jsonl]" \
    "--raw-stream-path[Raw stream jsonl path]:rawStreamPath:"
}

_openclaw_gateway_status() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to config/remote/local)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--no-probe[Skip RPC probe]" \
    "--require-rpc[Exit non-zero when the RPC probe fails]" \
    "--deep[Scan system-level services]" \
    "--json[Output JSON]"
}

_openclaw_gateway_install() {
  _arguments -C \
    "--port[Gateway port]:port:" \
    "--runtime[Daemon runtime (node|bun). Default: node]:runtime:" \
    "--token[Gateway token (token auth)]:token:" \
    "--wrapper[Executable wrapper for generated service ProgramArguments]:wrapper:" \
    "--force[Reinstall/overwrite if already installed]" \
    "--json[Output JSON]"
}

_openclaw_gateway_uninstall() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_gateway_start() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_gateway_stop() {
  _arguments -C \
    "--force[Allow stop from a non-interactive shell]" \
    "--json[Output JSON]" \
    "--disable[Persistently suppress KeepAlive/RunAtLoad so the gateway does not respawn until next start (launchd only)]"
}

_openclaw_gateway_restart() {
  _arguments -C \
    "--preserve-definition[Keep the native service definition]" \
    "--force[Restart immediately without waiting for active gateway work]" \
    "--safe[Request an OpenClaw-aware restart after active work drains (bounded wait; may force after the timeout expires)]" \
    "--skip-deferral[Bypass the safe-restart active-work deferral gate; close-stage reply drain still applies; requires --safe]" \
    "--wait[Wait duration before restart (ms, 10s, 5m; 0 waits indefinitely). For non-safe restarts (plain restart); not compatible with --force or --safe]:wait:" \
    "--json[Output JSON]"
}

_openclaw_gateway_restart_handoff_capabilities() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]"
}

_openclaw_gateway_restart_handoff_consume() {
  _arguments -C \
    "--expected-pid[PID of the exited gateway process]::expectedPid:" \
    "--json[Explicit machine-output spelling (command results are JSON by default)]"
}

_openclaw_gateway_restart_handoff() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'capabilities[Report the gateway restart-handoff machine contract]' 'consume[Atomically consume a gateway restart handoff]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (capabilities) _openclaw_gateway_restart_handoff_capabilities ;;
        (consume) _openclaw_gateway_restart_handoff_consume ;;
      esac
      ;;
  esac
}

_openclaw_gateway_auth_token() {
  _arguments -C \
    "--show[Print the token to an interactive terminal]"
}

_openclaw_gateway_call() {
  _arguments -C \
    "--params[JSON object string for params]:params:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output JSON]"
}

_openclaw_gateway_suspend() {
  _arguments -C \
    "--request-id[Stable suspension request id]:requestId:" \
    "--wait[Wait up to this many seconds for active work to drain]:wait:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output JSON]"
}

_openclaw_gateway_resume() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output JSON]"
}

_openclaw_gateway_usage_cost() {
  _arguments -C \
    "--days[Number of days to include]:days:" \
    "--agent[Scope the cost summary to a specific agent id]:agent:" \
    "--all-agents[Aggregate the cost summary across all agents]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output JSON]"
}

_openclaw_gateway_health() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output JSON]"
}

_openclaw_gateway_stability() {
  _arguments -C \
    "--limit[Maximum number of recent events]:limit:" \
    "--type[Filter by diagnostic event type]:type:" \
    "--since-seq[Only include events after this sequence]:sinceSeq:" \
    "--bundle[Read a persisted stability bundle instead of calling Gateway; pass \"latest\" for newest]::bundle:" \
    "--export[Write a shareable support diagnostics export]" \
    "--output[Diagnostics export output .zip path]:output:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output JSON]"
}

_openclaw_gateway_diagnostics_export() {
  _arguments -C \
    "--output[Output .zip path]:output:" \
    "--log-lines[Maximum sanitized log lines to include]:logLines:" \
    "--log-bytes[Maximum log bytes to inspect]:logBytes:" \
    "--url[Gateway WebSocket URL for health snapshot]:url:" \
    "--token[Gateway token for health snapshot]:token:" \
    "--password[Gateway password for health snapshot]:password:" \
    "--timeout[Status/health snapshot timeout in ms]:timeout:" \
    "--no-stability-bundle[Skip persisted stability bundle lookup]" \
    "--json[Output JSON]"
}

_openclaw_gateway_diagnostics() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'export[Write a shareable, payload-free diagnostics .zip]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (export) _openclaw_gateway_diagnostics_export ;;
      esac
      ;;
  esac
}

_openclaw_gateway_probe() {
  _arguments -C \
    "--url[Explicit Gateway WebSocket URL (still probes localhost)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--ssh[SSH target for remote gateway tunnel (user@host or user@host:port)]:ssh:" \
    "--ssh-identity[SSH identity file path]:sshIdentity:" \
    "--ssh-auto[Try to derive an SSH target from Bonjour discovery]" \
    "--token[Gateway token (applies to all probes)]:token:" \
    "--password[Gateway password (applies to all probes)]:password:" \
    "--timeout[Overall probe budget in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_gateway_discover() {
  _arguments -C \
    "--timeout[Per-command timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_gateway() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--port[Port for the gateway WebSocket]:port:" \
    "--bind[Bind mode (\"loopback\"|\"lan\"|\"tailnet\"|\"auto\"|\"custom\"). Defaults to config gateway.bind (or loopback).]:bind:" \
    "--token[Shared token required in connect.params.auth.token (default: OPENCLAW_GATEWAY_TOKEN env if set)]:token:" \
    "--auth[Gateway auth mode (\"none\"|\"token\"|\"password\"|\"trusted-proxy\")]:auth:" \
    "--password[Password for auth mode=password]:password:" \
    "--password-file[Read gateway password from file]:passwordFile:" \
    "--tailscale[Tailscale exposure mode (\"off\"|\"serve\"|\"funnel\")]:tailscale:" \
    "!--tailscale-reset-on-exit[]" \
    "--allow-unconfigured[Allow gateway start without enforcing gateway.mode=local in config (does not repair config)]" \
    "--dev[Create a dev config + workspace if missing (no BOOTSTRAP.md)]" \
    "--ambient-channels[Allow the gateway to auto-configure channels from ambient environment variables]" \
    "--dev-ambient-channels[Deprecated alias for --ambient-channels]" \
    "--reset[Reset dev config + credentials + sessions + workspace (requires --dev)]" \
    "!--task-supervisor[]" \
    "--force[Kill any existing listener on the target port before starting]" \
    "--verbose[Verbose logging to stdout/stderr]" \
    "--cli-backend-logs[Only show CLI backend logs in the console (includes stdout/stderr)]" \
    "--claude-cli-logs[Deprecated alias for --cli-backend-logs]" \
    "--ws-log[WebSocket log style (\"auto\"|\"full\"|\"compact\")]:wsLog:" \
    "--compact[Alias for \"--ws-log compact\"]" \
    "--raw-stream[Log raw model stream events to jsonl]" \
    "--raw-stream-path[Raw stream jsonl path]:rawStreamPath:" \
    "1: :_values 'command' 'auth-token[Reveal the configured shared Gateway token]' 'call[Call a Gateway method]' 'diagnostics[Export local support diagnostics]' 'discover[Discover gateways via Bonjour (local + wide-area if configured)]' 'health[Fetch Gateway health]' 'install[Install the Gateway service (launchd/systemd/schtasks)]' 'probe[Show gateway reachability, auth capability, and read-probe summary (local + remote)]' 'restart[Restart the Gateway service (launchd/systemd/schtasks)]' 'resume[Release a cooperative Gateway suspension]' 'run[Run the WebSocket Gateway (foreground)]' 'stability[Fetch payload-free Gateway stability diagnostics]' 'start[Start the Gateway service (launchd/systemd/schtasks)]' 'status[Show gateway service status + probe connectivity/capability]' 'stop[Stop the Gateway service (launchd/systemd/schtasks)]' 'suspend[Prepare the Gateway for cooperative host suspension]' 'uninstall[Uninstall the Gateway service (launchd/systemd/schtasks)]' 'usage-cost[Fetch usage cost summary from session logs]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (run) _openclaw_gateway_run ;;
        (status) _openclaw_gateway_status ;;
        (install) _openclaw_gateway_install ;;
        (uninstall) _openclaw_gateway_uninstall ;;
        (start) _openclaw_gateway_start ;;
        (stop) _openclaw_gateway_stop ;;
        (restart) _openclaw_gateway_restart ;;
        (restart-handoff) _openclaw_gateway_restart_handoff ;;
        (auth-token) _openclaw_gateway_auth_token ;;
        (call) _openclaw_gateway_call ;;
        (suspend) _openclaw_gateway_suspend ;;
        (resume) _openclaw_gateway_resume ;;
        (usage-cost) _openclaw_gateway_usage_cost ;;
        (health) _openclaw_gateway_health ;;
        (stability) _openclaw_gateway_stability ;;
        (diagnostics) _openclaw_gateway_diagnostics ;;
        (probe) _openclaw_gateway_probe ;;
        (discover) _openclaw_gateway_discover ;;
      esac
      ;;
  esac
}

_openclaw_daemon_status() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to config/remote/local)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--no-probe[Skip RPC probe]" \
    "--require-rpc[Exit non-zero when the RPC probe fails]" \
    "--deep[Scan system-level services]" \
    "--json[Output JSON]"
}

_openclaw_daemon_install() {
  _arguments -C \
    "--port[Gateway port]:port:" \
    "--runtime[Daemon runtime (node|bun). Default: node]:runtime:" \
    "--token[Gateway token (token auth)]:token:" \
    "--wrapper[Executable wrapper for generated service ProgramArguments]:wrapper:" \
    "--force[Reinstall/overwrite if already installed]" \
    "--json[Output JSON]"
}

_openclaw_daemon_uninstall() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_daemon_start() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_daemon_stop() {
  _arguments -C \
    "--force[Allow stop from a non-interactive shell]" \
    "--json[Output JSON]" \
    "--disable[Persistently suppress KeepAlive/RunAtLoad so the gateway does not respawn until next start (launchd only)]"
}

_openclaw_daemon_restart() {
  _arguments -C \
    "--preserve-definition[Keep the native service definition]" \
    "--force[Restart immediately without waiting for active gateway work]" \
    "--safe[Request an OpenClaw-aware restart after active work drains (bounded wait; may force after the timeout expires)]" \
    "--skip-deferral[Bypass the safe-restart active-work deferral gate; close-stage reply drain still applies; requires --safe]" \
    "--wait[Wait duration before restart (ms, 10s, 5m; 0 waits indefinitely). For non-safe restarts (plain restart); not compatible with --force or --safe]:wait:" \
    "--json[Output JSON]"
}

_openclaw_daemon() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output JSON]" \
    "1: :_values 'command' 'install[Install the Gateway service (launchd/systemd/schtasks)]' 'restart[Restart the Gateway service (launchd/systemd/schtasks)]' 'start[Start the Gateway service (launchd/systemd/schtasks)]' 'status[Show service install status + probe connectivity/capability]' 'stop[Stop the Gateway service (launchd/systemd/schtasks)]' 'uninstall[Uninstall the Gateway service (launchd/systemd/schtasks)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (status) _openclaw_daemon_status ;;
        (install) _openclaw_daemon_install ;;
        (uninstall) _openclaw_daemon_uninstall ;;
        (start) _openclaw_daemon_start ;;
        (stop) _openclaw_daemon_stop ;;
        (restart) _openclaw_daemon_restart ;;
      esac
      ;;
  esac
}

_openclaw_logs() {
  _arguments -C \
    "--limit[Max lines to return]:limit:" \
    "--max-bytes[Max bytes to read]:maxBytes:" \
    "--follow[Follow log output]" \
    "--interval[Polling interval in ms]:interval:" \
    "--json[Emit JSON log lines]" \
    "--plain[Plain text output (no ANSI styling)]" \
    "--no-color[Disable ANSI colors]" \
    "--local-time[Display timestamps in local timezone (default)]" \
    "--utc[Display timestamps in UTC]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_system_event() {
  _arguments -C \
    "--text[System event text]:text:" \
    "--mode[Wake mode (now|next-heartbeat)]:mode:" \
    "--session-key[Target a specific session for the event (defaults to the agent's main session)]:sessionKey:" \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_system_heartbeat_last() {
  _arguments -C \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_system_heartbeat_enable() {
  _arguments -C \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_system_heartbeat_disable() {
  _arguments -C \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_system_heartbeat() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'disable[Disable heartbeats]' 'enable[Enable heartbeats]' 'last[Show the last heartbeat event]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (last) _openclaw_system_heartbeat_last ;;
        (enable) _openclaw_system_heartbeat_enable ;;
        (disable) _openclaw_system_heartbeat_disable ;;
      esac
      ;;
  esac
}

_openclaw_system_presence() {
  _arguments -C \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_system() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'event[Enqueue a system event and optionally trigger a heartbeat]' 'heartbeat[Heartbeat controls]' 'presence[List system presence entries]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (event) _openclaw_system_event ;;
        (heartbeat) _openclaw_system_heartbeat ;;
        (presence) _openclaw_system_presence ;;
      esac
      ;;
  esac
}

_openclaw_models_accounts_list() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to the configured Gateway)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token-file[Read the Gateway token from a file]:tokenFile:" \
    "--password-file[Read the Gateway password from a file]:passwordFile:" \
    "--timeout[Gateway connection and request timeout in ms]:timeout:" \
    "--json[Output JSON]" \
    "--cursor[Continue from nextCursor in the previous page]:cursor:"
}

_openclaw_models_accounts_login() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to the configured Gateway)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token-file[Read the Gateway token from a file]:tokenFile:" \
    "--password-file[Read the Gateway password from a file]:passwordFile:" \
    "--timeout[Gateway connection and request timeout in ms]:timeout:" \
    "--json[Output JSON]" \
    "--method[Choose a sign-in method instead of prompting]:method:"
}

_openclaw_models_accounts_use() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to the configured Gateway)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token-file[Read the Gateway token from a file]:tokenFile:" \
    "--password-file[Read the Gateway password from a file]:passwordFile:" \
    "--timeout[Gateway connection and request timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_models_accounts_clear_default() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to the configured Gateway)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token-file[Read the Gateway token from a file]:tokenFile:" \
    "--password-file[Read the Gateway password from a file]:passwordFile:" \
    "--timeout[Gateway connection and request timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_models_accounts() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to the configured Gateway)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token-file[Read the Gateway token from a file]:tokenFile:" \
    "--password-file[Read the Gateway password from a file]:passwordFile:" \
    "--timeout[Gateway connection and request timeout in ms]:timeout:" \
    "--json[Output JSON]" \
    "1: :_values 'command' 'clear-default[Clear a personal default without deleting credentials or changing existing sessions]' 'list[List one page of your saved accounts]' 'login[Add a personal account using this Gateway'\''s provider and sign-in methods]' 'use[Select one of your accounts for new sessions]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_models_accounts_list ;;
        (login) _openclaw_models_accounts_login ;;
        (use) _openclaw_models_accounts_use ;;
        (clear-default) _openclaw_models_accounts_clear_default ;;
      esac
      ;;
  esac
}

_openclaw_models_list() {
  _arguments -C \
    "--all[Show full model catalog]" \
    "--local[Filter to local models]" \
    "--provider[Filter by provider id]:provider:" \
    "--agent[Agent id to inspect (overrides OPENCLAW_AGENT_DIR)]:agent:" \
    "--json[Output JSON]" \
    "--plain[Plain line output]"
}

_openclaw_models_status() {
  _arguments -C \
    "--json[Output JSON]" \
    "--plain[Plain output]" \
    "--check[Exit non-zero if auth is expiring/expired (1=expired/missing, 2=expiring)]" \
    "--probe[Probe configured provider auth (live)]" \
    "--probe-provider[Only probe a single provider]:probeProvider:" \
    "--probe-profile[Only probe specific auth profile ids (repeat or comma-separated)]:probeProfile:" \
    "--probe-timeout[Per-probe timeout in ms]:probeTimeout:" \
    "--probe-concurrency[Concurrent probes]:probeConcurrency:" \
    "--probe-max-tokens[Probe max tokens (best-effort)]:probeMaxTokens:" \
    "--agent[Agent id to inspect (overrides OPENCLAW_AGENT_DIR)]:agent:"
}

_openclaw_models_refresh() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_models_set() {
  _arguments -C \
    
}

_openclaw_models_set_image() {
  _arguments -C \
    
}

_openclaw_models_aliases_list() {
  _arguments -C \
    "--json[Output JSON]" \
    "--plain[Plain output]"
}

_openclaw_models_aliases_add() {
  _arguments -C \
    
}

_openclaw_models_aliases_remove() {
  _arguments -C \
    
}

_openclaw_models_aliases() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add or update a model alias]' 'list[List model aliases]' 'remove[Remove a model alias]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_models_aliases_list ;;
        (add) _openclaw_models_aliases_add ;;
        (remove) _openclaw_models_aliases_remove ;;
      esac
      ;;
  esac
}

_openclaw_models_fallbacks_list() {
  _arguments -C \
    "--json[Output JSON]" \
    "--plain[Plain output]"
}

_openclaw_models_fallbacks_add() {
  _arguments -C \
    
}

_openclaw_models_fallbacks_remove() {
  _arguments -C \
    
}

_openclaw_models_fallbacks_clear() {
  _arguments -C \
    
}

_openclaw_models_fallbacks() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add a fallback model]' 'clear[Clear all fallback models]' 'list[List fallback models]' 'remove[Remove a fallback model]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_models_fallbacks_list ;;
        (add) _openclaw_models_fallbacks_add ;;
        (remove) _openclaw_models_fallbacks_remove ;;
        (clear) _openclaw_models_fallbacks_clear ;;
      esac
      ;;
  esac
}

_openclaw_models_image_fallbacks_list() {
  _arguments -C \
    "--json[Output JSON]" \
    "--plain[Plain output]"
}

_openclaw_models_image_fallbacks_add() {
  _arguments -C \
    
}

_openclaw_models_image_fallbacks_remove() {
  _arguments -C \
    
}

_openclaw_models_image_fallbacks_clear() {
  _arguments -C \
    
}

_openclaw_models_image_fallbacks() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add an image fallback model]' 'clear[Clear all image fallback models]' 'list[List image fallback models]' 'remove[Remove an image fallback model]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_models_image_fallbacks_list ;;
        (add) _openclaw_models_image_fallbacks_add ;;
        (remove) _openclaw_models_image_fallbacks_remove ;;
        (clear) _openclaw_models_image_fallbacks_clear ;;
      esac
      ;;
  esac
}

_openclaw_models_scan() {
  _arguments -C \
    "--min-params[Minimum parameter size (billions)]:minParams:" \
    "--max-age-days[Skip models older than N days]:maxAgeDays:" \
    "--provider[Filter by provider prefix]:provider:" \
    "--max-candidates[Max fallback candidates]:maxCandidates:" \
    "--timeout[Per-probe timeout in ms]:timeout:" \
    "--concurrency[Probe concurrency]:concurrency:" \
    "--no-probe[Skip live probes; list free candidates only]" \
    "--yes[Accept defaults without prompting]" \
    "--no-input[Disable prompts (use defaults)]" \
    "--set-default[Set agents.defaults.model to the first selection]" \
    "--set-image[Set agents.defaults.imageModel to the first image selection]" \
    "--json[Output JSON]"
}

_openclaw_models_auth_list() {
  _arguments -C \
    "--provider[Filter by provider id]:provider:" \
    "--agent[Agent id (default: configured system agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_models_auth_add() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:"
}

_openclaw_models_auth_logout() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--yes[Skip the confirmation prompt]"
}

_openclaw_models_auth_login() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--provider[Provider id registered by a plugin]:provider:" \
    "--method[Provider auth method id]:method:" \
    "--device-code[Use the provider device-code auth method]" \
    "--profile-id[Auth profile id override for single-profile login methods]:profileId:" \
    "--set-default[Apply the provider's default model recommendation]" \
    "--force[Remove existing profiles for the provider before logging in (use when a cached OAuth profile is stuck or you want to switch accounts)]"
}

_openclaw_models_auth_setup_token() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--provider[Provider id]:provider:" \
    "--yes[Skip confirmation]"
}

_openclaw_models_auth_paste_token() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--provider[Provider id (e.g. anthropic)]:provider:" \
    "--profile-id[Auth profile id (default: <provider>:manual)]:profileId:" \
    "--expires-in[Optional expiry duration (e.g. 365d, 12h). Stored as absolute expiresAt.]:expiresIn:"
}

_openclaw_models_auth_paste_api_key() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--provider[Provider id (e.g. openai)]:provider:" \
    "--profile-id[Auth profile id (default: <provider>:manual)]:profileId:"
}

_openclaw_models_auth_login_github_copilot() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--yes[Overwrite existing profile without prompting]"
}

_openclaw_models_auth_order_get() {
  _arguments -C \
    "--provider[Provider id (e.g. anthropic)]:provider:" \
    "--agent[Agent id (default: configured system agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_models_auth_order_set() {
  _arguments -C \
    "--provider[Provider id (e.g. anthropic)]:provider:" \
    "--agent[Agent id (default: configured default agent)]:agent:"
}

_openclaw_models_auth_order_clear() {
  _arguments -C \
    "--provider[Provider id (e.g. anthropic)]:provider:" \
    "--agent[Agent id (default: configured default agent)]:agent:"
}

_openclaw_models_auth_order() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'clear[Clear per-agent auth profile order override]' 'get[Show per-agent auth profile order override]' 'set[Set per-agent auth profile order override]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (get) _openclaw_models_auth_order_get ;;
        (set) _openclaw_models_auth_order_set ;;
        (clear) _openclaw_models_auth_order_clear ;;
      esac
      ;;
  esac
}

_openclaw_models_auth() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent id for auth commands]:agent:" \
    "1: :_values 'command' 'add[Interactive auth helper (provider auth or paste token)]' 'list[List saved auth profiles]' 'login[Sign in for system/agent use on this machine (OAuth/API key)]' 'login-github-copilot[Login to GitHub Copilot via GitHub device flow (TTY required)]' 'logout[Remove a saved auth profile (see \`models auth list\` for ids)]' 'order[Manage per-agent auth profile order overrides]' 'paste-api-key[Save an API key in an auth profile and update config]' 'paste-token[Save a token in an auth profile and update config]' 'setup-token[Run a provider CLI to create/sync a token (TTY required)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_models_auth_list ;;
        (add) _openclaw_models_auth_add ;;
        (logout) _openclaw_models_auth_logout ;;
        (login) _openclaw_models_auth_login ;;
        (setup-token) _openclaw_models_auth_setup_token ;;
        (paste-token) _openclaw_models_auth_paste_token ;;
        (paste-api-key) _openclaw_models_auth_paste_api_key ;;
        (login-github-copilot) _openclaw_models_auth_login_github_copilot ;;
        (order) _openclaw_models_auth_order ;;
      esac
      ;;
  esac
}

_openclaw_models() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output JSON (alias for \`models status --json\`)]" \
    "--status-json[Output JSON (alias for \`models status --json\`)]" \
    "--status-plain[Plain output (alias for \`models status --plain\`)]" \
    "--agent[Agent id to inspect (overrides OPENCLAW_AGENT_DIR)]:agent:" \
    "1: :_values 'command' 'accounts[Manage your personal model accounts on the Gateway]' 'aliases[Manage model aliases]' 'auth[Manage system/agent credentials on this machine]' 'fallbacks[Manage model fallback list]' 'image-fallbacks[Manage image model fallback list]' 'list[List models (configured by default)]' 'refresh[Refresh the hosted model catalog]' 'scan[Scan OpenRouter free models for tools + images]' 'set[Set the default model]' 'set-image[Set the image model]' 'status[Show configured model state]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (accounts) _openclaw_models_accounts ;;
        (list) _openclaw_models_list ;;
        (status) _openclaw_models_status ;;
        (refresh) _openclaw_models_refresh ;;
        (set) _openclaw_models_set ;;
        (set-image) _openclaw_models_set_image ;;
        (aliases) _openclaw_models_aliases ;;
        (fallbacks) _openclaw_models_fallbacks ;;
        (image-fallbacks) _openclaw_models_image_fallbacks ;;
        (scan) _openclaw_models_scan ;;
        (auth) _openclaw_models_auth ;;
      esac
      ;;
  esac
}

_openclaw_promos_list() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_promos_claim() {
  _arguments -C \
    "--api-key[Provider API key for non-interactive setup]:apiKey:" \
    "--set-default[Set the promotion's suggested model as default without asking]"
}

_openclaw_promos() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'claim[Claim a promotion: set up provider auth and register its models]' 'list[List active promotions]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_promos_list ;;
        (claim) _openclaw_promos_claim ;;
      esac
      ;;
  esac
}

_openclaw_telemetry_show() {
  _arguments -C \
    "--json[Print the request and payload as JSON]"
}

_openclaw_telemetry_on() {
  _arguments -C \
    
}

_openclaw_telemetry_off() {
  _arguments -C \
    
}

_openclaw_telemetry() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'off[Disable anonymous feature statistics]' 'on[Enable anonymous feature statistics]' 'show[Show exactly what the daily update request sends]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (show) _openclaw_telemetry_show ;;
        (on) _openclaw_telemetry_on ;;
        (off) _openclaw_telemetry_off ;;
      esac
      ;;
  esac
}

_openclaw_infer_list() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_infer_inspect() {
  _arguments -C \
    "--name[Capability id]:name:" \
    "--json[Output JSON]"
}

_openclaw_infer_model_run() {
  _arguments -C \
    "--prompt[Prompt text]:prompt:" \
    "--file[Image file]:file:" \
    "--model[Model override]:model:" \
    "--thinking[Thinking level override]:thinking:" \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--agent[Agent whose model and credentials own the run (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_model_list() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_infer_model_inspect() {
  _arguments -C \
    "--model[Model id]:model:" \
    "--json[Output JSON]"
}

_openclaw_infer_model_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_model_auth_login() {
  _arguments -C \
    "--provider[Provider id]:provider:" \
    "--method[Provider auth method id]:method:" \
    "--agent[Agent id (default: configured default agent)]:agent:"
}

_openclaw_infer_model_auth_logout() {
  _arguments -C \
    "--provider[Provider id]:provider:" \
    "--agent[Agent id (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_model_auth_status() {
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_model_auth() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent id (default: configured default agent)]:agent:" \
    "1: :_values 'command' 'login[Run provider auth login]' 'logout[Remove saved auth profiles for one provider]' 'status[Show configured auth state]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (login) _openclaw_infer_model_auth_login ;;
        (logout) _openclaw_infer_model_auth_logout ;;
        (status) _openclaw_infer_model_auth_status ;;
      esac
      ;;
  esac
}

_openclaw_infer_model() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "1: :_values 'command' 'auth[Provider auth helpers]' 'inspect[Inspect one model catalog entry]' 'list[List known models]' 'providers[List model providers from the catalog]' 'run[Run a one-shot model turn]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (run) _openclaw_infer_model_run ;;
        (list) _openclaw_infer_model_list ;;
        (inspect) _openclaw_infer_model_inspect ;;
        (providers) _openclaw_infer_model_providers ;;
        (auth) _openclaw_infer_model_auth ;;
      esac
      ;;
  esac
}

_openclaw_infer_image_generate() {
  _arguments -C \
    "--prompt[Prompt text]:prompt:" \
    "--model[Model override]:model:" \
    "--count[Number of images]:count:" \
    "--size[Size hint like 1024x1024]:size:" \
    "--aspect-ratio[Aspect ratio hint like 16:9]:aspectRatio:" \
    "--resolution[Resolution hint: 1K, 2K, or 4K]:resolution:" \
    "--output-format[Output format hint: png, jpeg, or webp]:outputFormat:" \
    "--background[Background hint: transparent, opaque, or auto]:background:" \
    "--openai-background[OpenAI background hint: transparent, opaque, or auto]:openaiBackground:" \
    "--openai-moderation[OpenAI moderation hint: low or auto]:openaiModeration:" \
    "--quality[Quality hint: low, medium, high, or auto]:quality:" \
    "--timeout-ms[Provider request timeout in milliseconds]:timeoutMs:" \
    "--output[Output path]:output:" \
    "--agent[Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_image_edit() {
  _arguments -C \
    "--file[Input file]:file:" \
    "--prompt[Prompt text]:prompt:" \
    "--model[Model override]:model:" \
    "--count[Number of images]:count:" \
    "--size[Size hint like 1024x1024]:size:" \
    "--aspect-ratio[Aspect ratio hint like 16:9]:aspectRatio:" \
    "--resolution[Resolution hint: 1K, 2K, or 4K]:resolution:" \
    "--output-format[Output format hint: png, jpeg, or webp]:outputFormat:" \
    "--background[Background hint: transparent, opaque, or auto]:background:" \
    "--openai-background[OpenAI background hint: transparent, opaque, or auto]:openaiBackground:" \
    "--openai-moderation[OpenAI moderation hint: low or auto]:openaiModeration:" \
    "--quality[Quality hint: low, medium, high, or auto]:quality:" \
    "--timeout-ms[Provider request timeout in milliseconds]:timeoutMs:" \
    "--output[Output path]:output:" \
    "--agent[Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_image_describe() {
  _arguments -C \
    "--file[Image file]:file:" \
    "--prompt[Prompt hint]:prompt:" \
    "--model[Model override]:model:" \
    "--timeout-ms[Provider request timeout in milliseconds]:timeoutMs:" \
    "--agent[Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_image_describe_many() {
  _arguments -C \
    "--file[Image file]:file:" \
    "--prompt[Prompt hint]:prompt:" \
    "--model[Model override]:model:" \
    "--timeout-ms[Provider request timeout in milliseconds]:timeoutMs:" \
    "--agent[Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_image_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_image() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "1: :_values 'command' 'describe[Describe one image file]' 'describe-many[Describe multiple image files]' 'edit[Edit images with one or more input files]' 'generate[Generate images]' 'providers[List image generation providers]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (generate) _openclaw_infer_image_generate ;;
        (edit) _openclaw_infer_image_edit ;;
        (describe) _openclaw_infer_image_describe ;;
        (describe-many) _openclaw_infer_image_describe_many ;;
        (providers) _openclaw_infer_image_providers ;;
      esac
      ;;
  esac
}

_openclaw_infer_audio_transcribe() {
  _arguments -C \
    "--file[Audio file]:file:" \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "--language[Language hint]:language:" \
    "--prompt[Prompt hint]:prompt:" \
    "--model[Model override]:model:" \
    "--json[Output JSON]"
}

_openclaw_infer_audio_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_audio() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "1: :_values 'command' 'providers[List audio transcription providers]' 'transcribe[Transcribe one audio file]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (transcribe) _openclaw_infer_audio_transcribe ;;
        (providers) _openclaw_infer_audio_providers ;;
      esac
      ;;
  esac
}

_openclaw_infer_tts_convert() {
  _arguments -C \
    "--text[Input text]:text:" \
    "--channel[Channel hint]:channel:" \
    "--voice[Voice hint]:voice:" \
    "--provider[Speech provider id]:provider:" \
    "--model[Model override]:model:" \
    "--output[Output path]:output:" \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_voices() {
  _arguments -C \
    "--provider[Speech provider id]:provider:" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_personas() {
  _arguments -C \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_status() {
  _arguments -C \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_enable() {
  _arguments -C \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_disable() {
  _arguments -C \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_set_provider() {
  _arguments -C \
    "--provider[Speech provider id]:provider:" \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts_set_persona() {
  _arguments -C \
    "--persona[TTS persona id]:persona:" \
    "--off[Disable the active TTS persona]" \
    "--local[Force local execution]" \
    "--gateway[Force gateway execution]" \
    "--json[Output JSON]"
}

_openclaw_infer_tts() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'convert[Convert text to speech]' 'disable[Disable TTS]' 'enable[Enable TTS]' 'personas[List TTS personas]' 'providers[List speech providers]' 'set-persona[Set the active TTS persona]' 'set-provider[Set the active TTS provider]' 'status[Show TTS status]' 'voices[List voices for a TTS provider]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (convert) _openclaw_infer_tts_convert ;;
        (voices) _openclaw_infer_tts_voices ;;
        (providers) _openclaw_infer_tts_providers ;;
        (personas) _openclaw_infer_tts_personas ;;
        (status) _openclaw_infer_tts_status ;;
        (enable) _openclaw_infer_tts_enable ;;
        (disable) _openclaw_infer_tts_disable ;;
        (set-provider) _openclaw_infer_tts_set_provider ;;
        (set-persona) _openclaw_infer_tts_set_persona ;;
      esac
      ;;
  esac
}

_openclaw_infer_video_generate() {
  _arguments -C \
    "--prompt[Prompt text]:prompt:" \
    "--model[Model override]:model:" \
    "--size[Size hint like 1280x720]:size:" \
    "--aspect-ratio[Aspect ratio hint like 16:9]:aspectRatio:" \
    "--resolution[Resolution hint: 360P, 480P, 540P, 720P, 768P, or 1080P]:resolution:" \
    "--duration[Target duration in seconds]:duration:" \
    "--audio[Enable generated audio when supported]" \
    "--watermark[Request provider watermark when supported]" \
    "--timeout-ms[Provider request timeout in milliseconds]:timeoutMs:" \
    "--output[Output path]:output:" \
    "--agent[Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_video_describe() {
  _arguments -C \
    "--file[Video file]:file:" \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "--model[Model override]:model:" \
    "--json[Output JSON]"
}

_openclaw_infer_video_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_video() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "1: :_values 'command' 'describe[Describe one video file]' 'generate[Generate video]' 'providers[List video generation and description providers]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (generate) _openclaw_infer_video_generate ;;
        (describe) _openclaw_infer_video_describe ;;
        (providers) _openclaw_infer_video_providers ;;
      esac
      ;;
  esac
}

_openclaw_infer_web_search() {
  _arguments -C \
    "--query[Search query]:query:" \
    "--provider[Provider id]:provider:" \
    "--limit[Result limit]:limit:" \
    "--json[Output JSON]"
}

_openclaw_infer_web_fetch() {
  _arguments -C \
    "--url[URL]:url:" \
    "--provider[Provider id]:provider:" \
    "--format[Format hint]:format:" \
    "--json[Output JSON]"
}

_openclaw_infer_web_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_web() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'fetch[Fetch one URL]' 'providers[List web providers]' 'search[Run web search]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (search) _openclaw_infer_web_search ;;
        (fetch) _openclaw_infer_web_fetch ;;
        (providers) _openclaw_infer_web_providers ;;
      esac
      ;;
  esac
}

_openclaw_infer_embedding_create() {
  _arguments -C \
    "--text[Input text]:text:" \
    "--provider[Provider id]:provider:" \
    "--model[Model override]:model:" \
    "--agent[Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_embedding_providers() {
  _arguments -C \
    "--agent[Agent whose provider state should be inspected]:agent:" \
    "--json[Output JSON]"
}

_openclaw_infer_embedding() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent whose model and auth state should be used]:agent:" \
    "1: :_values 'command' 'create[Create embeddings]' 'providers[List embedding providers]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (create) _openclaw_infer_embedding_create ;;
        (providers) _openclaw_infer_embedding_providers ;;
      esac
      ;;
  esac
}

_openclaw_infer() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'audio[Audio transcription]' 'embedding[Embedding providers]' 'image[Image generation and description]' 'inspect[Inspect one canonical capability id]' 'list[List canonical capability ids and supported transports]' 'model[Text inference and model catalog commands]' 'tts[Text to speech]' 'video[Video generation and description]' 'web[Web capabilities]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_infer_list ;;
        (inspect) _openclaw_infer_inspect ;;
        (model) _openclaw_infer_model ;;
        (image) _openclaw_infer_image ;;
        (audio) _openclaw_infer_audio ;;
        (tts) _openclaw_infer_tts ;;
        (video) _openclaw_infer_video ;;
        (web) _openclaw_infer_web ;;
        (embedding) _openclaw_infer_embedding ;;
      esac
      ;;
  esac
}

_openclaw_approvals_pending() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_resolve() {
  _arguments -C \
    "--reason[Add a local note to the CLI confirmation]:reason:" \
    "--expires-in-days[Allow-always on an automation approval: freeze this grant lifetime instead of the configured default]:expiresInDays:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_grants_list() {
  _arguments -C \
    "--limit[Maximum rows to return (default 200)]:limit:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_grants_revoke() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_grants() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'list[List standing grants, newest first]' 'revoke[Revoke a standing grant; the next occurrence prompts again]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_approvals_grants_list ;;
        (revoke) _openclaw_approvals_grants_revoke ;;
      esac
      ;;
  esac
}

_openclaw_approvals_get() {
  _arguments -C \
    "--node[Target node id/name/IP]:node:" \
    "--gateway[Force gateway approvals]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_set() {
  _arguments -C \
    "--node[Target node id/name/IP]:node:" \
    "--gateway[Force gateway approvals]" \
    "--file[Path to JSON file to upload]:file:" \
    "--stdin[Read JSON from stdin]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_allowlist_add() {
  _arguments -C \
    "--node[Target node id/name/IP]:node:" \
    "--gateway[Force gateway approvals]" \
    "--agent[Agent id (defaults to \"*\")]:agent:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_allowlist_remove() {
  _arguments -C \
    "--node[Target node id/name/IP]:node:" \
    "--gateway[Force gateway approvals]" \
    "--agent[Agent id (defaults to \"*\")]:agent:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_approvals_allowlist() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'add[Add a glob pattern to an allowlist]' 'remove[Remove a glob pattern from an allowlist]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (add) _openclaw_approvals_allowlist_add ;;
        (remove) _openclaw_approvals_allowlist_remove ;;
      esac
      ;;
  esac
}

_openclaw_approvals() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'allowlist[Edit the per-agent allowlist]' 'get[Fetch exec approvals snapshot]' 'grants[Standing grants minted by allow-always on automation approvals]' 'pending[List pending exec, plugin, and system-agent approvals]' 'resolve[Resolve a pending approval]' 'set[Replace exec approvals with a JSON file]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (pending) _openclaw_approvals_pending ;;
        (resolve) _openclaw_approvals_resolve ;;
        (grants) _openclaw_approvals_grants ;;
        (get) _openclaw_approvals_get ;;
        (set) _openclaw_approvals_set ;;
        (allowlist) _openclaw_approvals_allowlist ;;
      esac
      ;;
  esac
}

_openclaw_exec_policy_show() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_exec_policy_preset() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_exec_policy_set() {
  _arguments -C \
    "--host[Exec host target: auto|sandbox|gateway|node]:host:" \
    "--security[Exec security: deny|allowlist|full]:security:" \
    "--ask[Exec ask mode: off|on-miss|always]:ask:" \
    "--ask-fallback[Host approvals fallback: deny|allowlist|full]:askFallback:" \
    "--json[Output as JSON]"
}

_openclaw_exec_policy() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'preset[Apply a synchronized preset: \"yolo\", \"cautious\", or \"deny-all\"]' 'set[Synchronize local config and host approvals using explicit values]' 'show[Show the local config policy, host approvals, and effective merge]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (show) _openclaw_exec_policy_show ;;
        (preset) _openclaw_exec_policy_preset ;;
        (set) _openclaw_exec_policy_set ;;
      esac
      ;;
  esac
}

_openclaw_nodes_status() {
  _arguments -C \
    "--connected[Only show connected nodes]" \
    "--last-connected[Only show nodes connected within duration (e.g. 24h)]:lastConnected:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_describe() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_list() {
  _arguments -C \
    "--connected[Only show connected nodes]" \
    "--last-connected[Only show nodes connected within duration (e.g. 24h)]:lastConnected:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_pending() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_approve() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_reject() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_remove() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_rename() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--name[New display name]:name:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_invoke() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--command[Command (e.g. canvas.navigate)]:command:" \
    "--params[JSON object string for params]:params:" \
    "--invoke-timeout[Node invoke timeout in ms (default 15000)]:invokeTimeout:" \
    "--idempotency-key[Idempotency key (optional)]:idempotencyKey:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_notify() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--title[Notification title]:title:" \
    "--body[Notification body]:body:" \
    "--sound[Notification sound]:sound:" \
    "--priority[Notification priority]:priority:(passive active timeSensitive)" \
    "--delivery[Delivery mode]:delivery:(system overlay auto)" \
    "--invoke-timeout[Node invoke timeout in ms (default 15000)]:invokeTimeout:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_push() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--title[Push title]:title:" \
    "--body[Push body]:body:" \
    "--environment[Override APNs environment]:environment:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_camera_list() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_camera_snap() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--facing[Camera facing]:facing:" \
    "--device-id[Camera device id (from nodes camera list)]:deviceId:" \
    "--max-width[Max width in px (optional)]:maxWidth:" \
    "--quality[JPEG quality (optional; platform-specific default)]:quality:" \
    "--delay-ms[Delay before capture in ms (optional; platform-specific default)]:delayMs:" \
    "--invoke-timeout[Node invoke timeout in ms (default 20000)]:invokeTimeout:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_camera_clip() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--facing[Camera facing]:facing:" \
    "--device-id[Camera device id (from nodes camera list)]:deviceId:" \
    "--duration[Duration (default 3000ms; supports ms/s/m, e.g. 10s)]:duration:" \
    "--no-audio[Disable audio capture]" \
    "--invoke-timeout[Node invoke timeout in ms (default 90000)]:invokeTimeout:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_camera() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'clip[Capture a short video clip from a node camera (prints the saved path)]' 'list[List available cameras on a node]' 'snap[Capture a photo from a node camera (prints the saved path)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_nodes_camera_list ;;
        (snap) _openclaw_nodes_camera_snap ;;
        (clip) _openclaw_nodes_camera_clip ;;
      esac
      ;;
  esac
}

_openclaw_nodes_screen_record() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--screen[Screen index (0 = primary)]:screen:" \
    "--duration[Clip duration (ms or 10s)]:duration:" \
    "--fps[Frames per second]:fps:" \
    "--no-audio[Disable microphone audio capture]" \
    "--out[Output path]:out:" \
    "--invoke-timeout[Node invoke timeout in ms (default 120000)]:invokeTimeout:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_screen() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'record[Capture a short screen recording from a node (prints the saved path)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (record) _openclaw_nodes_screen_record ;;
      esac
      ;;
  esac
}

_openclaw_nodes_location_get() {
  _arguments -C \
    "--node[Node id, name, or IP]:node:" \
    "--max-age[Use cached location newer than this (ms)]:maxAge:" \
    "--accuracy[Desired accuracy (default: balanced/precise depending on node setting)]:accuracy:" \
    "--location-timeout[Location fix timeout (ms)]:locationTimeout:" \
    "--invoke-timeout[Node invoke timeout in ms (default 20000)]:invokeTimeout:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_nodes_location() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'get[Fetch the current location from a node]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (get) _openclaw_nodes_location_get ;;
      esac
      ;;
  esac
}

_openclaw_nodes() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'approve[Approve a pending pairing request]' 'camera[Capture camera media from a paired node]' 'describe[Describe a node (capabilities + supported invoke commands)]' 'invoke[Invoke a command on a paired node]' 'list[List pending and paired nodes]' 'location[Fetch location from a paired node]' 'notify[Send a local notification on a node]' 'pending[List pending pairing requests]' 'push[Send an APNs test push to an iOS node]' 'reject[Reject a pending pairing request]' 'remove[Remove a paired node entry]' 'rename[Rename a paired node (display name override)]' 'screen[Capture screen recordings from a paired node]' 'status[List known nodes with connection status and capabilities]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (status) _openclaw_nodes_status ;;
        (describe) _openclaw_nodes_describe ;;
        (list) _openclaw_nodes_list ;;
        (pending) _openclaw_nodes_pending ;;
        (approve) _openclaw_nodes_approve ;;
        (reject) _openclaw_nodes_reject ;;
        (remove) _openclaw_nodes_remove ;;
        (rename) _openclaw_nodes_rename ;;
        (invoke) _openclaw_nodes_invoke ;;
        (notify) _openclaw_nodes_notify ;;
        (push) _openclaw_nodes_push ;;
        (camera) _openclaw_nodes_camera ;;
        (screen) _openclaw_nodes_screen ;;
        (location) _openclaw_nodes_location ;;
      esac
      ;;
  esac
}

_openclaw_devices_list() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_join_code() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_remove() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_clear() {
  _arguments -C \
    "--pending[Also reject all pending pairing requests]" \
    "--yes[Confirm destructive clear]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_approve() {
  _arguments -C \
    "--latest[Show the most recent pending request to approve explicitly]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_reject() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_rename() {
  _arguments -C \
    "--device[Device id]:device:" \
    "--name[Operator-assigned label (max 64 characters)]:name:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_rotate() {
  _arguments -C \
    "--device[Device id]:device:" \
    "--role[Role name]:role:" \
    "--scope[Scopes to attach to the token (repeatable)]:scope:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices_revoke() {
  _arguments -C \
    "--device[Device id]:device:" \
    "--role[Role name]:role:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (password auth)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_devices() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'approve[Approve a pending device pairing request]' 'clear[Clear paired devices from the gateway table]' 'join-code[Mint a single-use node onboarding URL]' 'list[List pending and paired devices]' 'reject[Reject a pending device pairing request]' 'remove[Remove a paired device entry]' 'rename[Assign an operator label to a paired device]' 'revoke[Revoke a device token for a role]' 'rotate[Rotate a device token for a role]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_devices_list ;;
        (join-code) _openclaw_devices_join_code ;;
        (remove) _openclaw_devices_remove ;;
        (clear) _openclaw_devices_clear ;;
        (approve) _openclaw_devices_approve ;;
        (reject) _openclaw_devices_reject ;;
        (rename) _openclaw_devices_rename ;;
        (rotate) _openclaw_devices_rotate ;;
        (revoke) _openclaw_devices_revoke ;;
      esac
      ;;
  esac
}

_openclaw_users_list() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_users_link_email() {
  _arguments -C \
    "--to[Target profile id]:to:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_users() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'link-email[Link an email alias to a user profile]' 'list[List durable user profiles]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_users_list ;;
        (link-email) _openclaw_users_link_email ;;
      esac
      ;;
  esac
}

_openclaw_node_worker() {
  _arguments -C \
    
}

_openclaw_node_run() {
  _arguments -C \
    "--pair[Pair with a setup code or oc-pair URL; explicit gateway flags take precedence]:pair:" \
    "--host[Gateway host]:host:" \
    "--port[Gateway port]:port:" \
    "--context-path[Gateway WebSocket context path (e.g. /openclaw-gw)]:contextPath:" \
    "--tls[Use TLS for the gateway connection]" \
    "--no-tls[Disable TLS for the gateway connection]" \
    "--tls-fingerprint[Expected TLS certificate fingerprint (sha256)]:tlsFingerprint:" \
    "--node-id[Override the generated node instance id]:nodeId:" \
    "--display-name[Override node display name]:displayName:" \
    "!--ephemeral[]" \
    "--share-installed-apps[Share installed macOS applications with the Gateway]" \
    "--no-share-installed-apps[Disable installed application sharing]"
}

_openclaw_node_status() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_node_identity() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_node_install() {
  _arguments -C \
    "--host[Gateway host]:host:" \
    "--port[Gateway port]:port:" \
    "--context-path[Gateway WebSocket context path (e.g. /openclaw-gw)]:contextPath:" \
    "--tls[Use TLS for the gateway connection]" \
    "--no-tls[Disable TLS for the gateway connection]" \
    "--tls-fingerprint[Expected TLS certificate fingerprint (sha256)]:tlsFingerprint:" \
    "--node-id[Override the generated node instance id]:nodeId:" \
    "--display-name[Override node display name]:displayName:" \
    "--share-installed-apps[Share installed macOS applications with the Gateway]" \
    "--no-share-installed-apps[Disable installed application sharing]" \
    "--runtime[Service runtime (node|bun). Default: node]:runtime:" \
    "--force[Reinstall/overwrite if already installed]" \
    "--json[Output JSON]"
}

_openclaw_node_uninstall() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_node_stop() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_node_start() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_node_restart() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_node() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'identity[Print the node host device identity (device id + public key)]' 'install[Install the node host service (launchd/systemd/schtasks)]' 'restart[Restart the node host service (launchd/systemd/schtasks)]' 'run[Run the headless node host (foreground)]' 'start[Start the node host service (launchd/systemd/schtasks)]' 'status[Show node host status]' 'stop[Stop the node host service (launchd/systemd/schtasks)]' 'uninstall[Uninstall the node host service (launchd/systemd/schtasks)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (worker) _openclaw_node_worker ;;
        (run) _openclaw_node_run ;;
        (status) _openclaw_node_status ;;
        (identity) _openclaw_node_identity ;;
        (install) _openclaw_node_install ;;
        (uninstall) _openclaw_node_uninstall ;;
        (stop) _openclaw_node_stop ;;
        (start) _openclaw_node_start ;;
        (restart) _openclaw_node_restart ;;
      esac
      ;;
  esac
}

_openclaw_connect() {
  _arguments -C \
    "--service[Install and run the node host as an OS service]" \
    "--ephemeral[Run as an environment-managed disposable session host]" \
    "--session-host[Host worker sessions (process-scoped unless installed as a service)]" \
    "--target-file[Read the connect target from a private file and remove it]:targetFile:" \
    "--display-name[Override the node display name]:displayName:"
}

_openclaw_worker() {
  _arguments -C \
    "!--internal-worker-ipc[]"
}

_openclaw_sandbox_list() {
  _arguments -C \
    "--json[Output result as JSON]" \
    "--browser[List browser containers only]"
}

_openclaw_sandbox_recreate() {
  _arguments -C \
    "--all[Recreate all sandbox containers]" \
    "--session[Recreate container for specific session]:session:" \
    "--agent[Recreate containers for specific agent]:agent:" \
    "--browser[Only recreate browser containers]" \
    "--force[Skip confirmation prompt]"
}

_openclaw_sandbox_explain() {
  _arguments -C \
    "--session[Session key to inspect (defaults to agent main)]:session:" \
    "--agent[Agent id to inspect (defaults to derived agent)]:agent:" \
    "--json[Output result as JSON]"
}

_openclaw_sandbox() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'explain[Explain effective sandbox/tool policy for a session/agent]' 'list[List sandbox containers and their status]' 'recreate[Remove containers to force recreation with updated config]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_sandbox_list ;;
        (recreate) _openclaw_sandbox_recreate ;;
        (explain) _openclaw_sandbox_explain ;;
      esac
      ;;
  esac
}

_openclaw_fleet_create() {
  _arguments -C \
    "--image[Container image]:image:" \
    "--runtime[Container runtime (docker or podman)]:runtime:" \
    "--port[Host loopback port (default: allocate from 19100)]:port:" \
    "--memory[Container memory limit]:memory:" \
    "--cpus[Container CPU limit]:cpus:" \
    "--disk[Cap the container writable layer (requires overlay2+XFS pquota, btrfs, or zfs)]:disk:" \
    "--network[Container egress network (bridge or internal)]:network:" \
    "--pids-limit[Container process limit]:pidsLimit:" \
    "--env[Pass an environment variable to the cell]:env:" \
    "--gateway-token[Use an existing Gateway token]:gatewayToken:" \
    "--no-start[Create the container without starting it]" \
    "--json[Output JSON]"
}

_openclaw_fleet_backup() {
  _arguments -C \
    "--out[Archive output path or directory]:out:" \
    "--max-bytes[Maximum archive input bytes]:maxBytes:" \
    "--json[Output JSON]"
}

_openclaw_fleet_restore() {
  _arguments -C \
    "--from[Fleet backup archive]:from:" \
    "--force[Stop a running cell and replace its state]" \
    "--max-bytes[Maximum extracted bytes]:maxBytes:" \
    "--json[Output JSON]"
}

_openclaw_fleet_doctor() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_fleet_list() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_fleet_status() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_fleet_logs() {
  _arguments -C \
    "--follow[Follow log output]" \
    "--tail[Number of lines to show]:tail:" \
    "--since[Show logs since a duration or timestamp]:since:"
}

_openclaw_fleet_start() {
  _arguments -C \
    
}

_openclaw_fleet_stop() {
  _arguments -C \
    
}

_openclaw_fleet_restart() {
  _arguments -C \
    
}

_openclaw_fleet_upgrade() {
  _arguments -C \
    "--image[Replacement image (default: recorded image)]:image:"
}

_openclaw_fleet_rm() {
  _arguments -C \
    "--purge-data[Delete the tenant data directory]" \
    "--force[Remove a running cell]"
}

_openclaw_fleet() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'backup[Back up one tenant cell as a host operator (archive contains secrets)]' 'create[Create an isolated tenant cell]' 'doctor[Audit fleet cells without changing them]' 'list[List tenant cells]' 'ls[List tenant cells]' 'logs[Stream tenant cell container logs]' 'restart[Restart a tenant cell]' 'restore[Restore one tenant cell as a host operator (archive contains secrets)]' 'rm[Remove a tenant cell]' 'start[Start a tenant cell]' 'status[Show tenant cell status]' 'stop[Stop a tenant cell]' 'upgrade[Replace a tenant cell with a freshly pulled image]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (create) _openclaw_fleet_create ;;
        (backup) _openclaw_fleet_backup ;;
        (restore) _openclaw_fleet_restore ;;
        (doctor) _openclaw_fleet_doctor ;;
        (list|ls) _openclaw_fleet_list ;;
        (status) _openclaw_fleet_status ;;
        (logs) _openclaw_fleet_logs ;;
        (start) _openclaw_fleet_start ;;
        (stop) _openclaw_fleet_stop ;;
        (restart) _openclaw_fleet_restart ;;
        (upgrade) _openclaw_fleet_upgrade ;;
        (rm) _openclaw_fleet_rm ;;
      esac
      ;;
  esac
}

_openclaw_worktrees_list() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_worktrees_create() {
  _arguments -C \
    "--name[Managed worktree name]:name:" \
    "--base-ref[Git ref to branch from]:baseRef:" \
    "--json[Output JSON]"
}

_openclaw_worktrees_remove() {
  _arguments -C \
    "--force[Remove even if snapshot creation fails]" \
    "--json[Output JSON]"
}

_openclaw_worktrees_restore() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_worktrees_gc() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_worktrees() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'create[Create a managed worktree]' 'gc[Run managed worktree cleanup now]' 'list[List active and restorable managed worktrees]' 'remove[Snapshot and remove a managed worktree]' 'restore[Restore a managed worktree from its snapshot]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_worktrees_list ;;
        (create) _openclaw_worktrees_create ;;
        (remove) _openclaw_worktrees_remove ;;
        (restore) _openclaw_worktrees_restore ;;
        (gc) _openclaw_worktrees_gc ;;
      esac
      ;;
  esac
}

_openclaw_attach() {
  _arguments -C \
    "--session[Gateway session key to bind (default: main session)]:session:" \
    "--url[Gateway WebSocket URL]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--tls-fingerprint[Expected Gateway TLS certificate fingerprint]:tlsFingerprint:" \
    "--ttl[Grant TTL in positive base-10 integer milliseconds (default: gateway policy)]:ttl:" \
    "--bin[Claude Code binary to spawn]:bin:" \
    "--print-config[Mint the grant + write the .mcp.json, print how to launch it, and exit without spawning]"
}

_openclaw_resume() {
  _arguments -C \
    "--handoff[Opaque session handoff copied from the Control UI]:handoff:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--tls-fingerprint[Expected Gateway TLS certificate fingerprint]:tlsFingerprint:"
}

_openclaw_tui() {
  _arguments -C \
    "--local[Run against the local embedded agent runtime]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--tls-fingerprint[Expected Gateway TLS certificate fingerprint]:tlsFingerprint:" \
    "--session[Session key (default: \"main\", or \"global\" when scope is global)]:session:" \
    "--deliver[Deliver assistant replies]" \
    "--thinking[Thinking level override]:thinking:" \
    "--message[Send an initial message after connecting]:message:" \
    "--timeout-ms[Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)]:timeoutMs:" \
    "--history-limit[History entries to load]:historyLimit:"
}

_openclaw_cron_status() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_list() {
  _arguments -C \
    "--all[Include disabled jobs]" \
    "--agent[Filter by agent id]:agent:" \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_add() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--name[Job name]:name:" \
    "--display-name[Human-readable job label]:displayName:" \
    "--description[Job description]:description:" \
    "--delete-after-run[Delete one-shot after successful completion (confirmed/no delivery, intentional silence, or best effort); failed/unknown required delivery retains it disabled]" \
    "--keep-after-run[Keep one-shot job after it succeeds]" \
    "--agent[Agent id for this job]:agent:" \
    "--session[Session target (main|isolated|current|session:<id>)]:session:" \
    "--session-key[Session key for job routing]:sessionKey:" \
    "--wake[Wake mode (now|next-heartbeat)]:wake:" \
    "--at[One-shot time (ISO, offset-less uses --tz) or duration like 20m]:at:" \
    "--every[Interval duration (e.g. 10m, 1h)]:every:" \
    "--pacing-min[Minimum delay for a dynamic next check]:pacingMin:" \
    "--pacing-max[Maximum delay for a dynamic next check]:pacingMax:" \
    "--cron[Cron expression (5-field or 6-field with seconds)]:cron:" \
    "--on-exit[Fire once when the watched command exits]:onExit:" \
    "--on-exit-cwd[Working directory for the --on-exit watched command]:onExitCwd:" \
    "--stream-command[Stream source argv as a JSON array of strings]:streamCommand:" \
    "--stream-cwd[Working directory for the stream source]:streamCwd:" \
    "--stream-mode[Stream line selection mode (line|match)]:streamMode:" \
    "--stream-match[Regex source required for stream match mode]:streamMatch:" \
    "--stream-batch-ms[Quiet-window batch delay in milliseconds]:streamBatchMs:" \
    "--stream-max-batch-bytes[Maximum UTF-8 bytes per stream batch]:streamMaxBatchBytes:" \
    "--tz[Timezone for cron expressions (IANA; cron default: Gateway host local timezone)]:tz:" \
    "--stagger[Cron stagger window (e.g. 30s, 5m)]:stagger:" \
    "--exact[Disable cron staggering (set stagger to 0)]" \
    "--trigger-script[Condition script file, or - for stdin]:triggerScript:" \
    "--trigger-once[Disable after the first successful triggered run]" \
    "--system-event[System event payload (main session)]:systemEvent:" \
    "--message[Agent message payload]:message:" \
    "--script[Headless script payload file, or - for stdin]:script:" \
    "--script-timeout-seconds[Script wall-clock timeout seconds]:scriptTimeoutSeconds:" \
    "--script-tool-budget[Maximum script tool calls]:scriptToolBudget:" \
    "--command[Command payload run as sh -lc <shell> on the Gateway]:command:" \
    "--command-argv[Command payload argv as JSON array of strings]:commandArgv:" \
    "--command-cwd[Working directory for command payloads]:commandCwd:" \
    "--command-env[Environment override for command payloads (repeatable)]:commandEnv:" \
    "--command-input[stdin for command payloads]:commandInput:" \
    "--thinking[Thinking level for agent jobs (off|minimal|low|medium|high|xhigh|adaptive|max|ultra)]:thinking:" \
    "--model[Model override for agent jobs (provider/model or alias)]:model:" \
    "--fallbacks[Fallback model list for agent jobs]:fallbacks:" \
    "--timeout-seconds[Timeout seconds for agent or command jobs]:timeoutSeconds:" \
    "--no-output-timeout-seconds[No-output timeout seconds for command jobs]:outputTimeoutSeconds:" \
    "--output-max-bytes[Maximum captured stdout/stderr bytes for command jobs]:outputMaxBytes:" \
    "--light-context[Use lightweight bootstrap context for agent jobs]" \
    "--tools[Tool allow-list (e.g. exec,read,write or exec read write)]:tools:" \
    "--announce[Fallback-deliver final text to a chat]" \
    "--deliver[Deprecated (use --announce). Fallback-delivers final text to a chat.]" \
    "--no-deliver[Disable runner fallback delivery]" \
    "--webhook[POST the finished payload to a webhook URL]:webhook:" \
    "--channel[Delivery channel (last|<channel-plugin-id>)]:channel:" \
    "--to[Delivery destination (E.164, Telegram chatId, or Discord channel/user)]:to:" \
    "--thread-id[Telegram forum topic thread id]:threadId:" \
    "--account[Channel account id for delivery (multi-account setups)]:account:" \
    "--best-effort-deliver[Do not fail the job if delivery fails]" \
    "--declaration-key[Idempotent declaration identity key]:declarationKey:" \
    "--disabled[Create job disabled]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_rm() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_enable() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_disable() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_get() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_show() {
  _arguments -C \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_runs() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--id[Job id (alternative to positional argument)]:id:" \
    "--run-id[Filter by cron run id]:runId:" \
    "--limit[Max entries (default 50)]:limit:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_run() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--due[Run only when due (default behavior in older versions)]" \
    "--wait[Wait for the queued run to finish]" \
    "--wait-timeout[Maximum time to wait for --wait]:waitTimeout:" \
    "--poll-interval[Polling interval for --wait]:pollInterval:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_scratch() {
  _arguments -C \
    "--json[Output scratch plus revision metadata as JSON; writes return JSON by default]" \
    "--set[Replace scratch with exact text]:set:" \
    "--file[Replace scratch from a file, or - for stdin]:file:" \
    "--unset[Remove the scratch row]" \
    "--expected-revision[Require the current scratch revision]:expectedRevision:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron_edit() {
  _arguments -C \
    "--json[Explicit machine-output spelling (command results are JSON by default)]" \
    "--name[Job name]:name:" \
    "--display-name[Human-readable job label]:displayName:" \
    "--description[Job description]:description:" \
    "--delete-after-run[Delete one-shot after successful completion (confirmed/no delivery, intentional silence, or best effort); failed/unknown required delivery retains it disabled]" \
    "--keep-after-run[Keep one-shot job after it succeeds]" \
    "--agent[Agent id for this job]:agent:" \
    "--session[Session target (main|isolated|current|session:<id>)]:session:" \
    "--session-key[Session key for job routing]:sessionKey:" \
    "--wake[Wake mode (now|next-heartbeat)]:wake:" \
    "--at[One-shot time (ISO, offset-less uses --tz) or duration like 20m]:at:" \
    "--every[Interval duration (e.g. 10m, 1h)]:every:" \
    "--pacing-min[Minimum delay for a dynamic next check]:pacingMin:" \
    "--pacing-max[Maximum delay for a dynamic next check]:pacingMax:" \
    "--cron[Cron expression (5-field or 6-field with seconds)]:cron:" \
    "--on-exit[Fire once when the watched command exits]:onExit:" \
    "--on-exit-cwd[Working directory for the --on-exit watched command]:onExitCwd:" \
    "--stream-command[Stream source argv as a JSON array of strings]:streamCommand:" \
    "--stream-cwd[Working directory for the stream source]:streamCwd:" \
    "--stream-mode[Stream line selection mode (line|match)]:streamMode:" \
    "--stream-match[Regex source required for stream match mode]:streamMatch:" \
    "--stream-batch-ms[Quiet-window batch delay in milliseconds]:streamBatchMs:" \
    "--stream-max-batch-bytes[Maximum UTF-8 bytes per stream batch]:streamMaxBatchBytes:" \
    "--tz[Timezone for cron expressions (IANA; cron default: Gateway host local timezone)]:tz:" \
    "--stagger[Cron stagger window (e.g. 30s, 5m)]:stagger:" \
    "--exact[Disable cron staggering (set stagger to 0)]" \
    "--trigger-script[Condition script file, or - for stdin]:triggerScript:" \
    "--trigger-once[Disable after the first successful triggered run]" \
    "--system-event[System event payload (main session)]:systemEvent:" \
    "--message[Agent message payload]:message:" \
    "--script[Headless script payload file, or - for stdin]:script:" \
    "--script-timeout-seconds[Script wall-clock timeout seconds]:scriptTimeoutSeconds:" \
    "--script-tool-budget[Maximum script tool calls]:scriptToolBudget:" \
    "--command[Command payload run as sh -lc <shell> on the Gateway]:command:" \
    "--command-argv[Command payload argv as JSON array of strings]:commandArgv:" \
    "--command-cwd[Working directory for command payloads]:commandCwd:" \
    "--command-env[Environment override for command payloads (repeatable)]:commandEnv:" \
    "--command-input[stdin for command payloads]:commandInput:" \
    "--thinking[Thinking level for agent jobs (off|minimal|low|medium|high|xhigh|adaptive|max|ultra)]:thinking:" \
    "--model[Model override for agent jobs (provider/model or alias)]:model:" \
    "--fallbacks[Fallback model list for agent jobs]:fallbacks:" \
    "--timeout-seconds[Timeout seconds for agent or command jobs]:timeoutSeconds:" \
    "--no-output-timeout-seconds[No-output timeout seconds for command jobs]:outputTimeoutSeconds:" \
    "--output-max-bytes[Maximum captured stdout/stderr bytes for command jobs]:outputMaxBytes:" \
    "--light-context[Use lightweight bootstrap context for agent jobs]" \
    "--tools[Tool allow-list (e.g. exec,read,write or exec read write)]:tools:" \
    "--announce[Fallback-deliver final text to a chat]" \
    "--deliver[Deprecated (use --announce). Fallback-delivers final text to a chat.]" \
    "--no-deliver[Disable runner fallback delivery]" \
    "--webhook[POST the finished payload to a webhook URL]:webhook:" \
    "--channel[Delivery channel (last|<channel-plugin-id>)]:channel:" \
    "--to[Delivery destination (E.164, Telegram chatId, or Discord channel/user)]:to:" \
    "--thread-id[Telegram forum topic thread id]:threadId:" \
    "--account[Channel account id for delivery (multi-account setups)]:account:" \
    "--best-effort-deliver[Do not fail job if delivery fails (also implies --announce when used alone)]" \
    "--clear-display-name[Restore the stable name in list and detail views]" \
    "--enable[Enable job]" \
    "--disable[Disable job]" \
    "--clear-agent[Unset agent and use default]" \
    "--clear-session-key[Unset session key]" \
    "--clear-pacing[Remove dynamic-cadence bounds]" \
    "--clear-trigger[Remove the condition trigger]" \
    "--clear-thinking[Remove the per-job thinking override (restore normal cron thinking precedence)]" \
    "--clear-fallbacks[Remove per-job fallback override]" \
    "--clear-model[Remove the per-job model override (restore normal cron model precedence)]" \
    "--no-light-context[Disable lightweight bootstrap context for agent jobs]" \
    "--clear-tools[Remove tool allow-list (use all tools)]" \
    "--clear-channel[Unset the delivery channel]" \
    "--clear-to[Unset the delivery destination]" \
    "--clear-thread-id[Unset the Telegram forum topic thread id]" \
    "--clear-account[Unset the per-job delivery account override]" \
    "--no-best-effort-deliver[Fail job when delivery fails]" \
    "--failure-alert[Enable failure alerts for this job]" \
    "--no-failure-alert[Disable failure alerts for this job]" \
    "--failure-alert-after[Alert after N consecutive job errors]:failureAlertAfter:" \
    "--failure-alert-channel[Failure alert channel (last|<channel-plugin-id>)]:failureAlertChannel:" \
    "--failure-alert-to[Failure alert destination]:failureAlertTo:" \
    "--failure-alert-cooldown[Minimum time between alerts (e.g. 1h, 30m)]:failureAlertCooldown:" \
    "--failure-alert-include-skipped[Count consecutive skipped runs toward alerts]" \
    "--failure-alert-exclude-skipped[Alert only on execution errors]" \
    "--failure-alert-mode[Failure alert delivery mode (announce or webhook)]:failureAlertMode:" \
    "--failure-alert-account-id[Account ID for failure alert channel (multi-account setups)]:failureAlertAccountId:" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_cron() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "1: :_values 'command' 'add[Add an automation]' 'create[Add an automation]' 'disable[Disable an automation]' 'edit[Edit an automation (patch fields)]' 'enable[Enable an automation]' 'get[Get an automation as JSON]' 'list[List automations]' 'rm[Remove an automation]' 'remove[Remove an automation]' 'delete[Remove an automation]' 'run[Run an automation now (debug)]' 'runs[Show automation run history]' 'scratch[Read or replace an automation'\''s private scratch]' 'show[Show an automation]' 'status[Show automations scheduler status]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (status) _openclaw_cron_status ;;
        (list) _openclaw_cron_list ;;
        (add|create) _openclaw_cron_add ;;
        (rm|remove|delete) _openclaw_cron_rm ;;
        (enable) _openclaw_cron_enable ;;
        (disable) _openclaw_cron_disable ;;
        (get) _openclaw_cron_get ;;
        (show) _openclaw_cron_show ;;
        (runs) _openclaw_cron_runs ;;
        (run) _openclaw_cron_run ;;
        (scratch) _openclaw_cron_scratch ;;
        (edit) _openclaw_cron_edit ;;
      esac
      ;;
  esac
}

_openclaw_dns_setup() {
  _arguments -C \
    "--domain[Wide-area discovery domain (e.g. openclaw.internal)]:domain:" \
    "--apply[Install/update CoreDNS config and (re)start the service (requires sudo)]"
}

_openclaw_dns() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'setup[Set up CoreDNS to serve your discovery domain for unicast DNS-SD (Wide-Area Bonjour)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (setup) _openclaw_dns_setup ;;
      esac
      ;;
  esac
}

_openclaw_docs() {
  _arguments -C \
    "--json[Output JSON]"
}

_openclaw_proxy_start() {
  _arguments -C \
    "--host[Bind host]:host:" \
    "--port[Bind port]:port:"
}

_openclaw_proxy_run() {
  _arguments -C \
    "--host[Bind host]:host:" \
    "--port[Bind port]:port:"
}

_openclaw_proxy_validate() {
  _arguments -C \
    "--json[Print machine-readable JSON]" \
    "--proxy-url[Proxy URL to validate instead of config/env]:proxyUrl:" \
    "--proxy-ca-file[CA bundle file for verifying an HTTPS proxy endpoint]:proxyCaFile:" \
    "--allowed-url[Destination expected to succeed through the proxy]:allowedUrl:" \
    "--denied-url[Destination expected to be blocked by the proxy]:deniedUrl:" \
    "--apns-reachable[Also verify sandbox APNs HTTP/2 is reachable through the proxy]" \
    "--apns-authority[APNs authority to probe with --apns-reachable]:apnsAuthority:" \
    "--timeout-ms[Per-request timeout in milliseconds]:timeoutMs:"
}

_openclaw_proxy_coverage() {
  _arguments -C \
    "--json[Print machine-readable JSON]"
}

_openclaw_proxy_sessions() {
  _arguments -C \
    "--json[Print machine-readable JSON]" \
    "--limit[Maximum sessions to show]:limit:"
}

_openclaw_proxy_query() {
  _arguments -C \
    "--preset[Query preset: double-sends, retry-storms, cache-busting, ws-duplicate-frames, missing-ack, error-bursts]:preset:" \
    "--json[Print machine-readable JSON]" \
    "--session[Restrict to a capture session id]:session:"
}

_openclaw_proxy_blob() {
  _arguments -C \
    "--id[Blob id]:id:"
}

_openclaw_proxy_purge() {
  _arguments -C \
    
}

_openclaw_proxy() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'blob[Read a captured payload blob by id]' 'coverage[Report current debug proxy transport coverage and remaining gaps]' 'purge[Delete all captured traffic metadata and blobs]' 'query[Run a built-in query preset against captured traffic]' 'run[Run a child command with OpenClaw debug proxy capture enabled]' 'sessions[List recent capture sessions]' 'start[Start the local explicit debug proxy]' 'validate[Validate the operator-managed network proxy]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (start) _openclaw_proxy_start ;;
        (run) _openclaw_proxy_run ;;
        (validate) _openclaw_proxy_validate ;;
        (coverage) _openclaw_proxy_coverage ;;
        (sessions) _openclaw_proxy_sessions ;;
        (query) _openclaw_proxy_query ;;
        (blob) _openclaw_proxy_blob ;;
        (purge) _openclaw_proxy_purge ;;
      esac
      ;;
  esac
}

_openclaw_hooks_list() {
  _arguments -C \
    "--agent[Agent id to inspect]:agent:" \
    "--eligible[Show only eligible hooks]" \
    "--json[Output as JSON]" \
    "(--verbose -v)"{--verbose,-v}"[Show more details including missing requirements]"
}

_openclaw_hooks_info() {
  _arguments -C \
    "--agent[Agent id to inspect]:agent:" \
    "--json[Output as JSON]"
}

_openclaw_hooks_check() {
  _arguments -C \
    "--agent[Agent id to inspect]:agent:" \
    "--json[Output as JSON]"
}

_openclaw_hooks_enable() {
  _arguments -C \
    "--agent[Agent id whose workspace to inspect]:agent:"
}

_openclaw_hooks_disable() {
  _arguments -C \
    "--agent[Agent id whose workspace to inspect]:agent:"
}

_openclaw_hooks_relay() {
  _arguments -C \
    "--provider[Native harness provider]:provider:" \
    "--relay-id[Native hook relay id]:relayId:" \
    "--state-db[Shared state database path]:stateDb:" \
    "--generation[Native hook relay registration generation]:generation:" \
    "--event[Native hook event]:event:" \
    "--pre-tool-use-unavailable[PreToolUse fallback mode when the originating relay is unavailable]:preToolUseUnavailable:" \
    "--timeout[Gateway timeout in ms]:timeout:"
}

_openclaw_hooks_install() {
  _arguments -C \
    "(--link -l)"{--link,-l}"[Link a local path instead of copying]" \
    "--pin[Record npm installs as exact resolved <name>@<version>]" \
    "--force[Confirm non-ClawHub sources and overwrite an existing hook pack]" \
    "--acknowledge-install-policy-warning[Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal]"
}

_openclaw_hooks_update() {
  _arguments -C \
    "--all[Update all tracked hooks]" \
    "--dry-run[Show what would change without writing]" \
    "--acknowledge-install-policy-warning[Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal]"
}

_openclaw_hooks() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent id to inspect]:agent:" \
    "--json[Output as JSON]" \
    "1: :_values 'command' 'check[Check hooks eligibility status]' 'disable[Disable a hook]' 'enable[Enable a hook]' 'info[Show detailed information about a hook]' 'install[Deprecated: install a hook pack via \`openclaw plugins install\`]' 'list[List all hooks]' 'update[Deprecated: update hook packs via \`openclaw plugins update\`]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_hooks_list ;;
        (info) _openclaw_hooks_info ;;
        (check) _openclaw_hooks_check ;;
        (enable) _openclaw_hooks_enable ;;
        (disable) _openclaw_hooks_disable ;;
        (relay) _openclaw_hooks_relay ;;
        (install) _openclaw_hooks_install ;;
        (update) _openclaw_hooks_update ;;
      esac
      ;;
  esac
}

_openclaw_webhooks_gmail_setup() {
  _arguments -C \
    "--account[Gmail account to watch]:account:" \
    "--project[GCP project id (OAuth client owner)]:project:" \
    "--topic[Pub/Sub topic name]:topic:" \
    "--subscription[Pub/Sub subscription name]:subscription:" \
    "--label[Gmail label to watch]:label:" \
    "--hook-url[OpenClaw hook URL]:hookUrl:" \
    "--hook-token[OpenClaw hook token]:hookToken:" \
    "--push-token[Push token for gog watch serve]:pushToken:" \
    "--bind[gog watch serve bind host]:bind:" \
    "--port[gog watch serve port]:port:" \
    "--path[gog watch serve path]:path:" \
    "--include-body[Include email body snippets]" \
    "--max-bytes[Max bytes for body snippets]:maxBytes:" \
    "--renew-minutes[Renew watch every N minutes]:renewMinutes:" \
    "--tailscale[Expose push endpoint via tailscale (funnel|serve|off)]:tailscale:" \
    "--tailscale-path[Path for tailscale serve/funnel]:tailscalePath:" \
    "--tailscale-target[Tailscale serve/funnel target (port, host:port, or URL)]:tailscaleTarget:" \
    "--push-endpoint[Explicit Pub/Sub push endpoint]:pushEndpoint:" \
    "--json[Output JSON summary]"
}

_openclaw_webhooks_gmail_run() {
  _arguments -C \
    "--account[Gmail account to watch]:account:" \
    "--topic[Pub/Sub topic path (projects/.../topics/..)]:topic:" \
    "--subscription[Pub/Sub subscription name]:subscription:" \
    "--label[Gmail label to watch]:label:" \
    "--hook-url[OpenClaw hook URL]:hookUrl:" \
    "--hook-token[OpenClaw hook token]:hookToken:" \
    "--push-token[Push token for gog watch serve]:pushToken:" \
    "--bind[gog watch serve bind host]:bind:" \
    "--port[gog watch serve port]:port:" \
    "--path[gog watch serve path]:path:" \
    "--include-body[Include email body snippets]" \
    "--max-bytes[Max bytes for body snippets]:maxBytes:" \
    "--renew-minutes[Renew watch every N minutes]:renewMinutes:" \
    "--tailscale[Expose push endpoint via tailscale (funnel|serve|off)]:tailscale:" \
    "--tailscale-path[Path for tailscale serve/funnel]:tailscalePath:" \
    "--tailscale-target[Tailscale serve/funnel target (port, host:port, or URL)]:tailscaleTarget:"
}

_openclaw_webhooks_gmail() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'run[Run gog watch serve + auto-renew loop]' 'setup[Configure Gmail watch + Pub/Sub + OpenClaw hooks]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (setup) _openclaw_webhooks_gmail_setup ;;
        (run) _openclaw_webhooks_gmail_run ;;
      esac
      ;;
  esac
}

_openclaw_webhooks() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'gmail[Gmail Pub/Sub hooks (via gogcli)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (gmail) _openclaw_webhooks_gmail ;;
      esac
      ;;
  esac
}

_openclaw_qr() {
  _arguments -C \
    "--remote[Use gateway.remote.url and gateway.remote token/password (ignores device-pair publicUrl)]" \
    "--url[Override gateway URL used in the setup payload]:url:" \
    "--public-url[Override gateway public URL used in the setup payload]:publicUrl:" \
    "--token[Override gateway token for setup payload]:token:" \
    "--password[Override gateway password for setup payload]:password:" \
    "--limited[Pair with limited operator access (omit operator.admin)]" \
    "--voice-node[Pair a voice node with node, read, and Talk access only]" \
    "--setup-code-only[Print only the setup code]" \
    "--no-ascii[Skip ASCII QR rendering]" \
    "--json[Output JSON]"
}

_openclaw_clawbot_qr() {
  _arguments -C \
    "--remote[Use gateway.remote.url and gateway.remote token/password (ignores device-pair publicUrl)]" \
    "--url[Override gateway URL used in the setup payload]:url:" \
    "--public-url[Override gateway public URL used in the setup payload]:publicUrl:" \
    "--token[Override gateway token for setup payload]:token:" \
    "--password[Override gateway password for setup payload]:password:" \
    "--limited[Pair with limited operator access (omit operator.admin)]" \
    "--voice-node[Pair a voice node with node, read, and Talk access only]" \
    "--setup-code-only[Print only the setup code]" \
    "--no-ascii[Skip ASCII QR rendering]" \
    "--json[Output JSON]"
}

_openclaw_clawbot() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'qr[Generate a mobile pairing QR code and setup code]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (qr) _openclaw_clawbot_qr ;;
      esac
      ;;
  esac
}

_openclaw_pairing_list() {
  _arguments -C \
    "--channel[Channel (none configured)]:channel:" \
    "--account[Account id (for multi-account channels)]:account:" \
    "--json[Print JSON]"
}

_openclaw_pairing_approve() {
  _arguments -C \
    "--channel[Channel (none configured)]:channel:" \
    "--account[Account id (for multi-account channels)]:account:" \
    "--notify[Notify the requester on the same channel]"
}

_openclaw_pairing() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'approve[Approve a pairing code and allow that sender]' 'list[List pending pairing requests]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_pairing_list ;;
        (approve) _openclaw_pairing_approve ;;
      esac
      ;;
  esac
}

_openclaw_plugins_list() {
  _arguments -C \
    "--json[Print JSON]" \
    "--enabled[Only show enabled plugins]" \
    "--verbose[Show detailed entries]"
}

_openclaw_plugins_search() {
  _arguments -C \
    "--limit[Max results]:limit:" \
    "--json[Print JSON]"
}

_openclaw_plugins_inspect() {
  _arguments -C \
    "--all[Inspect all plugins]" \
    "--runtime[Load plugin runtime for hooks/tools/diagnostics]" \
    "--json[Print JSON]"
}

_openclaw_plugins_enable() {
  _arguments -C \
    "--accept-capabilities[Accept the plugin's declared capabilities]"
}

_openclaw_plugins_disable() {
  _arguments -C \
    
}

_openclaw_plugins_uninstall() {
  _arguments -C \
    "--keep-files[Keep installed files on disk]" \
    "--keep-config[Deprecated alias for --keep-files]" \
    "--force[Skip confirmation prompt]" \
    "--dry-run[Show what would be removed without making changes]"
}

_openclaw_plugins_install() {
  _arguments -C \
    "(--link -l)"{--link,-l}"[Link a local path instead of copying]" \
    "--force[Confirm non-ClawHub sources and overwrite an existing plugin or hook pack]" \
    "--pin[Record npm installs as exact resolved <name>@<version>]" \
    "--accept-capabilities[Accept the plugin's declared capabilities]" \
    "--dangerously-force-unsafe-install[Deprecated no-op; security.installPolicy may still block]" \
    "--acknowledge-install-policy-warning[Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal]" \
    "--marketplace[Install a Claude marketplace plugin from a local repo/path or git/GitHub source]:marketplace:"
}

_openclaw_plugins_update() {
  _arguments -C \
    "--all[Update all tracked plugins and hook packs]" \
    "--dry-run[Show what would change without writing]" \
    "--accept-capabilities[Accept widened plugin capabilities]" \
    "--dangerously-force-unsafe-install[Deprecated no-op; security.installPolicy may still block]" \
    "--acknowledge-install-policy-warning[Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal]"
}

_openclaw_plugins_registry() {
  _arguments -C \
    "--json[Print JSON]" \
    "--refresh[Rebuild the persisted registry from current plugin manifests]"
}

_openclaw_plugins_doctor() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_plugins_build() {
  _arguments -C \
    "--root[Plugin package root]:root:" \
    "--entry[Plugin entry module relative to --root]:entry:" \
    "--check[Fail if generated metadata is out of date]"
}

_openclaw_plugins_validate() {
  _arguments -C \
    "--root[Plugin package root]:root:" \
    "--entry[Plugin entry module relative to --root]:entry:" \
    "--json[Print JSON]"
}

_openclaw_plugins_pack() {
  _arguments -C \
    "--root[Plugin package root]:root:" \
    "--out[Output .tgz file (must not exist)]:out:" \
    "--json[Print the artifact path, SHA256, and activation request]"
}

_openclaw_plugins_init() {
  _arguments -C \
    "--directory[Output directory]:directory:" \
    "--name[Display name]:name:" \
    "--type[Scaffold type (tool, provider, or feature)]:type:" \
    "--force[Overwrite an existing output directory]"
}

_openclaw_plugins_marketplace_entries() {
  _arguments -C \
    "--feed-profile[Configured marketplace feed profile to list]:feedProfile:" \
    "--feed-url[Explicit hosted marketplace feed URL]:feedUrl:" \
    "--offline[Read the latest accepted snapshot without fetching the feed]" \
    "--json[Print JSON]"
}

_openclaw_plugins_marketplace_refresh() {
  _arguments -C \
    "--feed-profile[Configured marketplace feed profile to refresh]:feedProfile:" \
    "--feed-url[Explicit hosted marketplace feed URL]:feedUrl:" \
    "--expected-sha256[Expected hosted feed SHA-256 payload checksum]:expectedSha256:" \
    "--json[Print JSON]"
}

_openclaw_plugins_marketplace_list() {
  _arguments -C \
    "--json[Print JSON]"
}

_openclaw_plugins_marketplace() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'entries[List entries from the configured OpenClaw marketplace feed]' 'list[List plugins published by a marketplace source]' 'refresh[Refresh the configured OpenClaw marketplace feed snapshot]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (entries) _openclaw_plugins_marketplace_entries ;;
        (refresh) _openclaw_plugins_marketplace_refresh ;;
        (list) _openclaw_plugins_marketplace_list ;;
      esac
      ;;
  esac
}

_openclaw_plugins() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'build[Build plugin metadata and native Control UI assets]' 'disable[Disable a plugin in config]' 'doctor[Report plugin load issues]' 'enable[Enable a plugin in config]' 'init[Create a plugin project]' 'inspect[Inspect plugin details]' 'info[Inspect plugin details]' 'install[Install a plugin or hook pack (path, archive, npm spec, git repo, clawhub:package, or marketplace entry)]' 'list[List discovered plugins]' 'marketplace[Inspect Claude-compatible plugin marketplaces]' 'pack[Bundle a built plugin into an exact artifact for activation approval]' 'registry[Inspect or rebuild the persisted plugin registry]' 'search[Search ClawHub plugin packages]' 'uninstall[Uninstall a plugin]' 'update[Update installed plugins and tracked hook packs]' 'validate[Validate plugin metadata and native Control UI assets]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_plugins_list ;;
        (search) _openclaw_plugins_search ;;
        (inspect|info) _openclaw_plugins_inspect ;;
        (enable) _openclaw_plugins_enable ;;
        (disable) _openclaw_plugins_disable ;;
        (uninstall) _openclaw_plugins_uninstall ;;
        (install) _openclaw_plugins_install ;;
        (update) _openclaw_plugins_update ;;
        (registry) _openclaw_plugins_registry ;;
        (doctor) _openclaw_plugins_doctor ;;
        (build) _openclaw_plugins_build ;;
        (validate) _openclaw_plugins_validate ;;
        (pack) _openclaw_plugins_pack ;;
        (init) _openclaw_plugins_init ;;
        (marketplace) _openclaw_plugins_marketplace ;;
      esac
      ;;
  esac
}

_openclaw_channels_list() {
  _arguments -C \
    "--all[Include bundled and installable catalog channels]" \
    "--json[Output JSON]"
}

_openclaw_channels_status() {
  _arguments -C \
    "--channel[Only show one channel (all|telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch)]:channel:" \
    "--probe[Probe channel credentials]" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_channels_capabilities() {
  _arguments -C \
    "--agent[Agent owner for channel discovery]:agent:" \
    "--channel[Channel (all|telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch)]:channel:" \
    "--account[Account id (only with --channel)]:account:" \
    "--target[Channel target for permission audit (Discord channel:<id>)]:target:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--json[Output JSON]"
}

_openclaw_channels_resolve() {
  _arguments -C \
    "--channel[Channel (telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch)]:channel:" \
    "--account[Account id (accountId)]:account:" \
    "--agent[Agent owner for channel resolution]:agent:" \
    "--kind[Target kind (auto|user|group|channel)]:kind:(auto user group channel)" \
    "--json[Output JSON]"
}

_openclaw_channels_logs() {
  _arguments -C \
    "--channel[Channel (all|telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch; default: all)]:channel:" \
    "--lines[Number of lines (default: 200)]:lines:" \
    "--json[Output JSON]"
}

_openclaw_channels_dead_letters_list() {
  _arguments -C \
    "--channel[Channel id]:channel:" \
    "--account[Account id]:account:" \
    "--limit[Maximum entries]:limit:" \
    "--json[Output JSON]"
}

_openclaw_channels_dead_letters_resubmit() {
  _arguments -C \
    "--channel[Channel id]:channel:" \
    "--account[Account id]:account:" \
    "--json[Output JSON]"
}

_openclaw_channels_dead_letters() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--account[Account id]:account:" \
    "1: :_values 'command' 'list[List failed inbound events for one channel account]' 'resubmit[Re-enqueue one failed inbound event]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_channels_dead_letters_list ;;
        (resubmit) _openclaw_channels_dead_letters_resubmit ;;
      esac
      ;;
  esac
}

_openclaw_channels_add() {
  _arguments -C \
    "--channel[Channel (telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch)]:channel:" \
    "--agent[Agent owner for channel setup]:agent:" \
    "--account[Account id (default when omitted)]:account:" \
    "--name[Display name for this account]:name:" \
    "--advertised-url[Public Gateway origin published in the A2A agent card]:advertisedUrl:" \
    "--peer-name[A2A peer identifier to authorize]:peerName:" \
    "--peer-token[Bearer token for the A2A peer]:peerToken:" \
    "--token[Telegram bot token]:token:" \
    "--token-file[Telegram bot token file]:tokenFile:" \
    "--use-env[Use TELEGRAM_BOT_TOKEN]" \
    "--audience-type[Google Chat audience type]:audienceType:" \
    "--audience[Google Chat audience value]:audience:" \
    "--webhook-path[Google Chat webhook path]:webhookPath:" \
    "--webhook-url[Google Chat webhook URL]:webhookUrl:" \
    "--private-key[Nostr private key]:privateKey:" \
    "--relay-urls[Nostr relay URLs]:relayUrls:" \
    "--relay-url[Buzz relay WebSocket URL]:relayUrl:" \
    "--bot-token[Mattermost bot token]:botToken:" \
    "--http-url[Mattermost server URL]:httpUrl:" \
    "--base-url[Nextcloud base URL]:baseUrl:" \
    "--url[Legacy Nextcloud base URL alias]:url:" \
    "--secret[Nextcloud Talk bot secret]:secret:" \
    "--password[Legacy Nextcloud bot secret alias]:password:" \
    "--secret-file[Nextcloud Talk bot secret file]:secretFile:" \
    "--homeserver[Matrix homeserver URL]:homeserver:" \
    "--user-id[Matrix user id]:userId:" \
    "--access-token[Matrix access token]:accessToken:" \
    "--device-name[Matrix device name]:deviceName:" \
    "--avatar-url[Matrix avatar URL]:avatarUrl:" \
    "--initial-sync-limit[Matrix initial sync room limit]:initialSyncLimit:" \
    "--proxy[Matrix proxy URL]:proxy:" \
    "--dangerously-allow-private-network[Allow private-network Matrix homeservers]" \
    "--profile[Raft CLI profile]:profile:" \
    "--channel-access-token[LINE channel access token]:channelAccessToken:" \
    "--channel-secret[LINE channel secret]:channelSecret:" \
    "--code[ClickClack one-time setup code or setup URL]:code:" \
    "--workspace[ClickClack workspace id, slug, or name]:workspace:" \
    "--default-to[Default ClickClack target]:defaultTo:" \
    "--allow-from[Allowed ClickClack senders]:allowFrom:" \
    "--agent-activity[Enable ClickClack agent activity]" \
    "--account-sid[Twilio account SID]:accountSid:" \
    "--auth-token[Twilio auth token]:authToken:" \
    "--from-number[Twilio sender phone number]:fromNumber:" \
    "--messaging-service-sid[Twilio Messaging Service SID]:messagingServiceSid:" \
    "--public-webhook-url[Public SMS webhook URL]:publicWebhookUrl:" \
    "--dm-policy[SMS DM policy]:dmPolicy:" \
    "--ship[Tlon ship]:ship:" \
    "--group-channels[Tlon group channels]:groupChannels:" \
    "--dm-allowlist[Tlon DM allowlist]:dmAllowlist:" \
    "--auto-discover-channels[Auto-discover Tlon group channels]" \
    "--no-auto-discover-channels[Auto-discover Tlon group channels]" \
    "--owner-ship[Tlon owner ship]:ownerShip:" \
    "--cli-path[iMessage CLI path]:cliPath:" \
    "--db-path[iMessage database path]:dbPath:" \
    "--service[iMessage service]:service:" \
    "--region[SMS region]:region:" \
    "--host[IRC server host]:host:" \
    "--port[IRC server port]:port:" \
    "--tls[Use TLS for IRC]" \
    "--nick[IRC nickname]:nick:" \
    "--username[IRC username]:username:" \
    "--realname[IRC real name]:realname:" \
    "--channels[IRC channels]:channels:" \
    "--signal-number[Signal account number (E.164)]:signalNumber:" \
    "--signal-transport[Signal HTTP transport (external-native or container)]:signalTransport:" \
    "--http-host[Signal HTTP daemon host]:httpHost:" \
    "--http-port[Signal HTTP daemon port]:httpPort:" \
    "--app-token[Slack app token]:appToken:" \
    "--user-token[Slack user token]:userToken:" \
    "--signing-secret[Slack signing secret]:signingSecret:" \
    "--identity[Slack identity]:identity:" \
    "--mode[Slack connection mode]:mode:" \
    "--auth-dir[WhatsApp auth directory override]:authDir:"
}

_openclaw_channels_remove() {
  _arguments -C \
    "--agent[Agent owner for channel discovery]:agent:" \
    "--channel[Channel (telegram|whatsapp|discord|irc|googlechat|slack|signal|imessage|feishu|nostr|buzz|msteams|mattermost|nextcloud-talk|matrix|raft|a2a|line|zalo|clickclack|zalouser|sms|synology-chat|tlon|qa-channel|reef|twitch)]:channel:" \
    "--account[Account id (default when omitted)]:account:" \
    "--delete[Delete config entries (no prompt)]"
}

_openclaw_channels_login() {
  _arguments -C \
    "--agent[Agent owner for channel discovery]:agent:" \
    "--channel[Channel alias (auto when only one is configured)]:channel:" \
    "--account[Account id (accountId)]:account:" \
    "--verbose[Verbose connection logs]"
}

_openclaw_channels_logout() {
  _arguments -C \
    "--agent[Agent owner for channel discovery]:agent:" \
    "--channel[Channel alias (auto when only one is configured)]:channel:" \
    "--account[Account id (accountId)]:account:"
}

_openclaw_channels() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Agent owner for channel commands that require workspace context]:agent:" \
    "1: :_values 'command' 'add[Add or update a channel account]' 'capabilities[Show provider capabilities (intents/scopes + supported features)]' 'dead-letters[Inspect and resubmit failed inbound channel events]' 'list[List chat channels (configured by default; pass --all for installable catalog)]' 'login[Link a channel account (if supported)]' 'logout[Log out of a channel session (if supported)]' 'logs[Show recent channel logs from the gateway log file]' 'remove[Disable or delete a channel account]' 'resolve[Resolve channel/user names to IDs]' 'status[Show gateway channel status (use status --deep for local)]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_channels_list ;;
        (status) _openclaw_channels_status ;;
        (capabilities) _openclaw_channels_capabilities ;;
        (resolve) _openclaw_channels_resolve ;;
        (logs) _openclaw_channels_logs ;;
        (dead-letters) _openclaw_channels_dead_letters ;;
        (add) _openclaw_channels_add ;;
        (remove) _openclaw_channels_remove ;;
        (login) _openclaw_channels_login ;;
        (logout) _openclaw_channels_logout ;;
      esac
      ;;
  esac
}

_openclaw_directory_self() {
  _arguments -C \
    "--channel[Channel (auto when only one is configured)]:channel:" \
    "--account[Account id (accountId)]:account:" \
    "--json[Output JSON]"
}

_openclaw_directory_peers_list() {
  _arguments -C \
    "--channel[Channel (auto when only one is configured)]:channel:" \
    "--account[Account id (accountId)]:account:" \
    "--json[Output JSON]" \
    "--query[Optional search query]:query:" \
    "--limit[Limit results]:limit:"
}

_openclaw_directory_peers() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'list[List peers]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_directory_peers_list ;;
      esac
      ;;
  esac
}

_openclaw_directory_groups_list() {
  _arguments -C \
    "--channel[Channel (auto when only one is configured)]:channel:" \
    "--account[Account id (accountId)]:account:" \
    "--json[Output JSON]" \
    "--query[Optional search query]:query:" \
    "--limit[Limit results]:limit:"
}

_openclaw_directory_groups_members() {
  _arguments -C \
    "--group-id[Group id]:groupId:" \
    "--channel[Channel (auto when only one is configured)]:channel:" \
    "--account[Account id (accountId)]:account:" \
    "--json[Output JSON]" \
    "--limit[Limit results]:limit:"
}

_openclaw_directory_groups() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'list[List groups]' 'members[List group members]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_directory_groups_list ;;
        (members) _openclaw_directory_groups_members ;;
      esac
      ;;
  esac
}

_openclaw_directory() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'groups[Group directory]' 'peers[Peer directory (contacts/users)]' 'self[Show the current account user]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (self) _openclaw_directory_self ;;
        (peers) _openclaw_directory_peers ;;
        (groups) _openclaw_directory_groups ;;
      esac
      ;;
  esac
}

_openclaw_security_audit() {
  _arguments -C \
    "--deep[Attempt live Gateway probes and plugin-owned collector checks]" \
    "--auth[Runtime gateway auth mode (\"none\"|\"token\"|\"password\"|\"trusted-proxy\")]:auth:" \
    "--token[Use explicit gateway token for deep probe auth]:token:" \
    "--password[Use explicit gateway password for deep probe auth]:password:" \
    "--fix[Apply safe fixes (tighten defaults + chmod state/config)]" \
    "--json[Print JSON]"
}

_openclaw_security() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'audit[Audit config + local state for common security foot-guns]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (audit) _openclaw_security_audit ;;
      esac
      ;;
  esac
}

_openclaw_secrets_store_list() {
  _arguments -C \
    "--scope[Store scope]:scope:" \
    "--json[Output JSON]" \
    "--plain[Output tab-separated rows]"
}

_openclaw_secrets_store_set() {
  _arguments -C \
    "--value[Literal value (env kind only)]:value:" \
    "--value-file[Read value from a file; use - for stdin]:valueFile:" \
    "--kind[Entry kind (defaults from NAME)]:kind:" \
    "--allow-host[Allow substitution only for this exact host (repeatable)]:allowHost:" \
    "--clear-allowed-hosts[Remove all allowed hosts]" \
    "--scope[Store scope]:scope:" \
    "--dry-run[Validate without writing]"
}

_openclaw_secrets_store_get() {
  _arguments -C \
    "--scope[Store scope]:scope:" \
    "--json[Output JSON]" \
    "--plain[Output only the env value]"
}

_openclaw_secrets_store_rm() {
  _arguments -C \
    "--scope[Store scope]:scope:" \
    "--dry-run[Show what would be removed]" \
    "--yes[Skip confirmation]"
}

_openclaw_secrets_store_import() {
  _arguments -C \
    "--from[Dotenv file; use - or omit for stdin]:from:" \
    "--kind[Override the detected kind for all entries]:kind:" \
    "--scope[Store scope]:scope:" \
    "--dry-run[Validate without writing]" \
    "--yes[Skip confirmation]"
}

_openclaw_secrets_store() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'get[Read an env-kind value; secret-kind values are write-only]' 'import[Import dotenv-formatted entries from a file or stdin]' 'list[List stored names and non-secret metadata]' 'rm[Soft-delete one or more entries]' 'set[Create or update one store entry]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_secrets_store_list ;;
        (set) _openclaw_secrets_store_set ;;
        (get) _openclaw_secrets_store_get ;;
        (rm) _openclaw_secrets_store_rm ;;
        (import) _openclaw_secrets_store_import ;;
      esac
      ;;
  esac
}

_openclaw_secrets_reload() {
  _arguments -C \
    "--json[Output JSON]" \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]"
}

_openclaw_secrets_audit() {
  _arguments -C \
    "--check[Exit non-zero when findings are present]" \
    "--allow-exec[Allow exec SecretRef resolution during audit (may execute provider commands)]" \
    "--json[Output JSON]"
}

_openclaw_secrets_configure() {
  _arguments -C \
    "--apply[Apply changes immediately after preflight]" \
    "--yes[Skip apply confirmation prompt]" \
    "--providers-only[Configure secrets.providers only, skip credential mapping]" \
    "--skip-provider-setup[Skip provider setup and only map credential fields to existing providers]" \
    "--agent[Agent id for auth-profiles targets (default: configured default agent)]:agent:" \
    "--allow-exec[Allow exec SecretRef preflight checks (may execute provider commands)]" \
    "--plan-out[Write generated plan JSON to a file (max 16 MiB)]:planOut:" \
    "--json[Output JSON]"
}

_openclaw_secrets_apply() {
  _arguments -C \
    "--from[Path to plan JSON (max 16 MiB)]:from:" \
    "--dry-run[Validate/preflight only]" \
    "--allow-exec[Allow exec SecretRef checks (may execute provider commands)]" \
    "--json[Output JSON]"
}

_openclaw_secrets() {
  local -a commands
  local -a options
  
  _arguments -C \
     \
    "1: :_values 'command' 'apply[Apply a previously generated secrets plan]' 'audit[Audit plaintext secrets, unresolved refs, and precedence drift]' 'configure[Interactive secrets helper (provider setup + SecretRef mapping + preflight)]' 'reload[Re-resolve secret references and atomically swap runtime snapshot]' 'store[Manage the team-scoped SQLite secret and environment store]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (store) _openclaw_secrets_store ;;
        (reload) _openclaw_secrets_reload ;;
        (audit) _openclaw_secrets_audit ;;
        (configure) _openclaw_secrets_configure ;;
        (apply) _openclaw_secrets_apply ;;
      esac
      ;;
  esac
}

_openclaw_skills_library_list() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--scope[Library scope]:scope:(mine team all)" \
    "--session[Include this session’s selected revisions and attachable skills]:session:"
}

_openclaw_skills_library_read() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--revision[Read a retained revision]:revision:" \
    "--session[Read an exact session pin (requires --revision)]:session:"
}

_openclaw_skills_library_create() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--slug[Library name (lowercase letters, digits, hyphens)]:slug:"
}

_openclaw_skills_library_update() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read; conflicts never overwrite]:expectedRevision:" \
    "--slug[Change the library name]:slug:" \
    "--delete-file[Explicitly remove a supporting file (repeatable)]:deleteFile:"
}

_openclaw_skills_library_import() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--slug[Destination name in your personal library]:slug:" \
    "--clawhub[Read source from ClawHub; never publishes your files]" \
    "--version[ClawHub version]:version:"
}

_openclaw_skills_library_remove() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:"
}

_openclaw_skills_library_share() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:"
}

_openclaw_skills_library_unshare() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:"
}

_openclaw_skills_library_transfer() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:"
}

_openclaw_skills_library_enable() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:"
}

_openclaw_skills_library_disable() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:"
}

_openclaw_skills_library_rollback() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--expected-revision[Current revision from library read]:expectedRevision:" \
    "--revision[Retained revision to restore]:revision:"
}

_openclaw_skills_library_attach() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--session[Exact target session key]:session:" \
    "--skill-id[Stable library skill ID]:skillId:" \
    "--revision[Retained revision to select]:revision:"
}

_openclaw_skills_library_detach() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--session[Exact target session key]:session:" \
    "--skill-id[Stable library skill ID]:skillId:"
}

_openclaw_skills_library_refresh() {
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "--session[Exact target session key]:session:" \
    "--skill-id[Refresh only this selected skill; omit to refresh all]:skillId:"
}

_openclaw_skills_library() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--url[Gateway WebSocket URL (defaults to gateway.remote.url when configured)]:url:" \
    "--port[Local Gateway port]:port:" \
    "--token[Gateway token (if required)]:token:" \
    "--password[Gateway password (if required)]:password:" \
    "--timeout[Timeout in ms]:timeout:" \
    "--expect-final[Wait for final response (agent)]" \
    "--json[Output as JSON]" \
    "1: :_values 'command' 'attach[Attach managed selections explicitly for the next session turn]' 'create[Save a private skill from SKILL.md or a complete local directory]' 'detach[Detach managed selections explicitly for the next session turn]' 'disable[Disable a managed skill]' 'enable[Enable a managed skill]' 'import[Privately import a local bundle, ZIP, or ClawHub skill]' 'list[List your own and visible shared skills]' 'read[Read the complete SKILL.md, supporting files, and revision history]' 'refresh[Refresh managed selections explicitly for the next session turn]' 'remove[Remove a managed skill]' 'rollback[Rollback a managed skill]' 'share[Share a managed skill]' 'transfer[Transfer ownership to the team (administrator only)]' 'unshare[Unshare a managed skill]' 'update[Save a revision; a single SKILL.md preserves supporting files, a directory replaces the bundle]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_skills_library_list ;;
        (read) _openclaw_skills_library_read ;;
        (create) _openclaw_skills_library_create ;;
        (update) _openclaw_skills_library_update ;;
        (import) _openclaw_skills_library_import ;;
        (remove) _openclaw_skills_library_remove ;;
        (share) _openclaw_skills_library_share ;;
        (unshare) _openclaw_skills_library_unshare ;;
        (transfer) _openclaw_skills_library_transfer ;;
        (enable) _openclaw_skills_library_enable ;;
        (disable) _openclaw_skills_library_disable ;;
        (rollback) _openclaw_skills_library_rollback ;;
        (attach) _openclaw_skills_library_attach ;;
        (detach) _openclaw_skills_library_detach ;;
        (refresh) _openclaw_skills_library_refresh ;;
      esac
      ;;
  esac
}

_openclaw_skills_search() {
  _arguments -C \
    "--limit[Max results]:limit:" \
    "--json[Output as JSON]"
}

_openclaw_skills_install() {
  _arguments -C \
    "--version[Install a specific version]:version:" \
    "--force[Overwrite an existing workspace skill]" \
    "--force-install[Install a pending GitHub-backed skill before ClawHub scan completes]" \
    "--acknowledge-install-policy-warning[Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal]" \
    "--global[Install into the shared managed skills directory]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:" \
    "--as[Install a git/local skill under this slug]:as:"
}

_openclaw_skills_update() {
  _arguments -C \
    "--all[Update all tracked ClawHub skills]" \
    "--force[Replace installed skills even when they have local changes]" \
    "--force-install[Install a pending GitHub-backed skill before ClawHub scan completes]" \
    "--acknowledge-install-policy-warning[Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal]" \
    "--global[Update skills in the shared managed skills directory]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_verify() {
  _arguments -C \
    "--version[Verify a specific version]:version:" \
    "--tag[Verify a dist tag]:tag:" \
    "--card[Print the generated Skill Card Markdown]" \
    "--json[Output as JSON]" \
    "--global[Resolve installed skill metadata from the shared managed skills directory]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_curator_status() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_skills_curator_pin() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_skills_curator_unpin() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_skills_curator_restore() {
  _arguments -C \
    "--json[Output as JSON]"
}

_openclaw_skills_curator() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output as JSON]" \
    "1: :_values 'command' 'pin[pin is retired; collection review manages skills]' 'restore[restore is retired; collection review manages skills]' 'status[Show skill usage and collection review status]' 'unpin[unpin is retired; collection review manages skills]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (status) _openclaw_skills_curator_status ;;
        (pin) _openclaw_skills_curator_pin ;;
        (unpin) _openclaw_skills_curator_unpin ;;
        (restore) _openclaw_skills_curator_restore ;;
      esac
      ;;
  esac
}

_openclaw_skills_workshop_list() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_inspect() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_propose_create() {
  _arguments -C \
    "--name[Skill name]:name:" \
    "--description[Skill description]:description:" \
    "--proposal[Path to PROPOSAL.md draft content]:proposal:" \
    "--proposal-dir[Path to proposal directory with PROPOSAL.md and UTF-8 text support files]:proposalDir:" \
    "--goal[Proposal or improvement goal]:goal:" \
    "--evidence[Evidence or notes for the proposal]:evidence:" \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_propose_update() {
  _arguments -C \
    "--proposal[Path to PROPOSAL.md draft content]:proposal:" \
    "--proposal-dir[Path to proposal directory with PROPOSAL.md and UTF-8 text support files]:proposalDir:" \
    "--description[Concise proposal description]:description:" \
    "--goal[Proposal or improvement goal]:goal:" \
    "--evidence[Evidence or notes for the proposal]:evidence:" \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_revise() {
  _arguments -C \
    "--proposal[Path to revised PROPOSAL.md draft content]:proposal:" \
    "--proposal-dir[Path to revised proposal directory with PROPOSAL.md and UTF-8 text support files]:proposalDir:" \
    "--description[Replacement proposal description]:description:" \
    "--goal[Replacement research or improvement goal]:goal:" \
    "--evidence[Replacement evidence or notes for the proposal]:evidence:" \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_evaluate() {
  _arguments -C \
    "--correlation-id[External run or experiment correlation id]:correlationId:" \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_apply() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_reject() {
  _arguments -C \
    "--reason[Reason for rejection]:reason:" \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop_quarantine() {
  _arguments -C \
    "--reason[Reason for quarantine]:reason:" \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_workshop() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:" \
    "1: :_values 'command' 'apply[Apply a pending skill proposal]' 'evaluate[Evaluate the exact current skill proposal through Gateway plugins]' 'inspect[Inspect a skill proposal]' 'list[List pending and completed skill proposals]' 'propose-create[Create a pending proposal for a new workspace skill]' 'propose-update[Create a pending proposal for an existing workspace skill]' 'quarantine[Quarantine a skill proposal]' 'reject[Reject a pending skill proposal]' 'revise[Revise a pending skill proposal]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (list) _openclaw_skills_workshop_list ;;
        (inspect) _openclaw_skills_workshop_inspect ;;
        (propose-create) _openclaw_skills_workshop_propose_create ;;
        (propose-update) _openclaw_skills_workshop_propose_update ;;
        (revise) _openclaw_skills_workshop_revise ;;
        (evaluate) _openclaw_skills_workshop_evaluate ;;
        (apply) _openclaw_skills_workshop_apply ;;
        (reject) _openclaw_skills_workshop_reject ;;
        (quarantine) _openclaw_skills_workshop_quarantine ;;
      esac
      ;;
  esac
}

_openclaw_skills_list() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--eligible[Show only eligible (ready to use) skills]" \
    "(--verbose -v)"{--verbose,-v}"[Show more details including missing requirements]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_info() {
  _arguments -C \
    "--json[Output as JSON]" \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:"
}

_openclaw_skills_check() {
  _arguments -C \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:" \
    "--json[Output as JSON]"
}

_openclaw_skills() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--agent[Target agent workspace (defaults to cwd-inferred, then default agent)]:agent:" \
    "--json[Output as JSON]" \
    "1: :_values 'command' 'check[Check which skills are ready, visible, or missing requirements]' 'curator[Inspect skill usage and collection review outcomes]' 'info[Show detailed information about a skill]' 'install[Install a skill from ClawHub, git, or a local directory]' 'library[Manage authenticated personal and team skill libraries]' 'list[List all available skills]' 'search[Search ClawHub skills]' 'update[Update ClawHub-installed skills in the active or shared managed directory]' 'verify[Verify a ClawHub skill with ClawHub]' 'workshop[Manage pending skill proposals]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (library) _openclaw_skills_library ;;
        (search) _openclaw_skills_search ;;
        (install) _openclaw_skills_install ;;
        (update) _openclaw_skills_update ;;
        (verify) _openclaw_skills_verify ;;
        (curator) _openclaw_skills_curator ;;
        (workshop) _openclaw_skills_workshop ;;
        (list) _openclaw_skills_list ;;
        (info) _openclaw_skills_info ;;
        (check) _openclaw_skills_check ;;
      esac
      ;;
  esac
}

_openclaw_update_cleanup() {
  _arguments -C \
    "--dry-run[Inspect recovery metadata without writes]" \
    "--json[Output one JSON result; never implies consent]" \
    "--yes[Acknowledge permanent loss of the selected rollback originals]"
}

_openclaw_update_repair() {
  _arguments -C \
    "--json[Output result as JSON]" \
    "--channel[Persist update channel before repair]:channel:" \
    "--timeout[Timeout for update repair steps in seconds (default: 1800)]:timeout:" \
    "--yes[Skip confirmation prompts (non-interactive)]" \
    "--accept-capabilities[Accept widened plugin capabilities]" \
    "--no-restart[Accepted for update command parity; repair never restarts]"
}

_openclaw_update_finalize() {
  _arguments -C \
    "--json[Output result as JSON]" \
    "--channel[Persist update channel before repair]:channel:" \
    "--timeout[Timeout for update repair steps in seconds (default: 1800)]:timeout:" \
    "--yes[Skip confirmation prompts (non-interactive)]" \
    "--accept-capabilities[Accept widened plugin capabilities]" \
    "--no-restart[Accepted for update command parity; repair never restarts]"
}

_openclaw_update_wizard() {
  _arguments -C \
    "--accept-capabilities[Accept widened plugin capabilities]" \
    "--timeout[Timeout for each update step in seconds (default: 1800)]:timeout:"
}

_openclaw_update_status() {
  _arguments -C \
    "--json[Output result as JSON]" \
    "--timeout[Timeout for update checks in seconds (default: 3)]:timeout:"
}

_openclaw_update() {
  local -a commands
  local -a options
  
  _arguments -C \
    "--json[Output result as JSON]" \
    "--no-restart[Skip restarting the gateway service after a successful update]" \
    "--dry-run[Preview update actions without making changes]" \
    "--channel[Persist update channel (git + npm)]:channel:" \
    "--tag[Override the package target for this update (dist-tag, version, or package spec)]:tag:" \
    "--timeout[Timeout for each update step in seconds (default: 1800)]:timeout:" \
    "--yes[Skip confirmation prompts (non-interactive)]" \
    "--accept-capabilities[Accept widened plugin capabilities]" \
    "1: :_values 'command' 'cleanup[Retire verified update recovery originals after acknowledging rollback loss]' 'repair[Repair post-update doctor and plugin convergence]' 'status[Show update channel and version status]' 'wizard[Interactive update wizard]'" \
    "*::arg:->args"

  case $state in
    (args)
      case $line[1] in
        (cleanup) _openclaw_update_cleanup ;;
        (repair) _openclaw_update_repair ;;
        (finalize) _openclaw_update_finalize ;;
        (wizard) _openclaw_update_wizard ;;
        (status) _openclaw_update_status ;;
      esac
      ;;
  esac
}


_openclaw_register_completion() {
  if (( ! $+functions[compdef] )); then
    return 0
  fi

  compdef _openclaw_root_completion openclaw
  precmd_functions=(${precmd_functions:#_openclaw_register_completion})
  unfunction _openclaw_register_completion 2>/dev/null
}

_openclaw_register_completion
if (( ! $+functions[compdef] )); then
  typeset -ga precmd_functions
  if [[ -z "${precmd_functions[(r)_openclaw_register_completion]}" ]]; then
    precmd_functions+=(_openclaw_register_completion)
  fi
fi
