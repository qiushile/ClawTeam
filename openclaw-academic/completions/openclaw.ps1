
Register-ArgumentCompleter -Native -CommandName openclaw -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)
    
    $commandElements = $commandAst.CommandElements
    $commandPath = ""
    $valueOptions = @('--container','--profile','--log-level')
    $previousElementIndex = if ($wordToComplete -eq '') { $commandElements.Count - 1 } else { $commandElements.Count - 2 }
    $previousElement = if ($previousElementIndex -ge 1) { $commandElements[$previousElementIndex].Extent.Text } else { '' }
    $choiceFlag = $previousElement
    $choicePrefix = $wordToComplete
    $choiceCompletionPrefix = ''
    if ($wordToComplete -match '^(--[^=]+)=(.*)$') {
        $choiceFlag = $Matches[1]
        $choicePrefix = $Matches[2]
        $choiceCompletionPrefix = "$choiceFlag="
    }

    # Skip option values so global and nested flags cannot hide the command path.
    for ($i = 1; $i -lt $commandElements.Count; $i++) {
        $element = $commandElements[$i].Extent.Text
        if ($i -eq $commandElements.Count - 1 -and $wordToComplete -ne "") { break }
        if ($element -like "-*") {
            $flag = ($element -split '=', 2)[0]
            if ($element -notlike '*=*' -and $valueOptions -contains $flag) {
                $i++
            }
            continue
        }

        $candidatePath = if ($commandPath -eq '') { $element } else { "$commandPath $element" }
        switch ($candidatePath) {
            'completion' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-s','--shell')
            }
            'setup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--workspace','--agent-name','--reset-scope','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--tailscale','--daemon-runtime','--node-manager','--import-from','--import-source','--remote-url','--remote-token','--remote-password','-m','--message')
            }
            'crestodian' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-m','--message')
            }
            'onboard' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--workspace','--agent-name','--reset-scope','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--remote-url','--remote-token','--remote-password','--tailscale','--daemon-runtime','--node-manager','--import-from','--import-source')
            }
            'onboard recommendations' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--workspace','--agent-name','--reset-scope','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--remote-url','--remote-token','--remote-password','--tailscale','--daemon-runtime','--node-manager','--import-from','--import-source')
            }
            'onboard recommendations acknowledge' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--workspace','--agent-name','--reset-scope','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--remote-url','--remote-token','--remote-password','--tailscale','--daemon-runtime','--node-manager','--import-from','--import-source','--retry')
            }
            'onboard recommendations refresh' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--workspace','--agent-name','--reset-scope','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--remote-url','--remote-token','--remote-password','--tailscale','--daemon-runtime','--node-manager','--import-from','--import-source')
            }
            'configure' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'config' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'config get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'config set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section','--expect-current-json','--ref-provider','--ref-source','--ref-id','--provider-source','--provider-allowlist','--provider-path','--provider-mode','--provider-timeout-ms','--provider-max-bytes','--provider-command','--provider-arg','--provider-no-output-timeout-ms','--provider-max-output-bytes','--provider-env','--provider-pass-env','--provider-trusted-dir','--batch-json','--batch-file')
            }
            'config patch' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section','--file','--replace-path')
            }
            'config unset' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'config file' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'config schema' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'config validate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--section')
            }
            'backup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'backup create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--output')
            }
            'backup verify' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'backup restore' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--target')
            }
            'backup sqlite' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'backup sqlite create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--repository')
            }
            'backup sqlite list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository')
            }
            'backup sqlite verify' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--scratch')
            }
            'backup sqlite restore' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--target')
            }
            'backup git' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'backup git init' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository','--remote')
            }
            'backup git create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository','--agent')
            }
            'backup git log' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository','--limit')
            }
            'backup git verify' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository','--ref','--agent')
            }
            'backup git restore' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository','--target','--ref','--agent')
            }
            'backup enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--repository','--every','--agent','--url','--port','--token','--password','--timeout')
            }
            'backup disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'database' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'database preflight' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'database ownership' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'database ownership status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'database ownership claim' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--manager')
            }
            'migrate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from','--agent','--skill','--plugin','--item','--backup-output')
            }
            'migrate list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from','--agent','--skill','--plugin','--item','--backup-output')
            }
            'migrate plan' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from','--agent','--skill','--plugin','--item','--backup-output')
            }
            'migrate apply' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from','--agent','--skill','--plugin','--item','--backup-output')
            }
            'doctor' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--session-sqlite','--state-sqlite','--session-sqlite-store','--session-sqlite-agent','--severity-min','--skip','--only')
            }
            'triage' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--update-result')
            }
            'dashboard' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'reset' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--scope')
            }
            'uninstall' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message send' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-m','--message','-t','--target','--media','--presentation','--delivery','--reply-to','--thread-id','--channel','--account')
            }
            'message broadcast' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account','--targets','--message','--media')
            }
            'message poll' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--poll-question','--poll-option','--poll-duration-hours','--poll-duration-seconds','-m','--message','--thread-id')
            }
            'message react' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--message-id','--emoji','--participant','--target-author','--target-author-uuid')
            }
            'message reactions' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--message-id','--limit')
            }
            'message read' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--limit','--message-id','--before','--after','--around','--thread-id')
            }
            'message edit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--message-id','-m','--message','-t','--target','--channel','--account','--thread-id')
            }
            'message delete' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--message-id','-t','--target','--channel','--account')
            }
            'message pin' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--message-id')
            }
            'message unpin' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--message-id','--pinned-message-id')
            }
            'message pins' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--limit')
            }
            'message permissions' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account')
            }
            'message search' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account','--guild-id','--query','--channel-id','--channel-ids','--author-id','--author-ids','--limit')
            }
            'message thread' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message thread create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--thread-name','-t','--target','--channel','--account','--message-id','-m','--message','--auto-archive-min')
            }
            'message thread list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--channel','--account','--channel-id','--before','--limit')
            }
            'message thread reply' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-m','--message','-t','--target','--channel','--account','--media','--reply-to')
            }
            'message emoji' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message emoji list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account','--guild-id')
            }
            'message emoji upload' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--channel','--account','--emoji-name','--media','--role-ids')
            }
            'message sticker' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message sticker send' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account','--sticker-id','-m','--message')
            }
            'message sticker upload' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--channel','--account','--sticker-name','--sticker-desc','--sticker-tags','--media')
            }
            'message role' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message role info' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--channel','--account')
            }
            'message role add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--user-id','--role-id','--channel','--account')
            }
            'message role remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--user-id','--role-id','--channel','--account')
            }
            'message channel' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message channel info' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-t','--target','--channel','--account')
            }
            'message channel list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--channel','--account')
            }
            'message member' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message member info' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--user-id','--channel','--account','--guild-id')
            }
            'message voice' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message voice status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--user-id','--channel','--account')
            }
            'message event' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'message event list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--channel','--account')
            }
            'message event create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--event-name','--start-time','--channel','--account','--end-time','--desc','--channel-id','--location','--event-type','--image')
            }
            'message timeout' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--user-id','--channel','--account','--duration-min','--until','--reason')
            }
            'message kick' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--user-id','--channel','--account','--reason')
            }
            'message ban' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--guild-id','--user-id','--channel','--account','--reason','--delete-days')
            }
            'mcp' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp serve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--token-file','--password','--password-file','--claude-channel-mode')
            }
            'mcp list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp probe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp doctor' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--command','--arg','--env','--cwd','--url','--transport','--header','--auth','--oauth-scope','--oauth-redirect-url','--oauth-client-metadata-url','--include','--exclude','--timeout','--connect-timeout','--approval','--ssl-verify','--client-cert','--client-key')
            }
            'mcp set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp tools' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--include','--exclude')
            }
            'mcp configure' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--include','--exclude','--timeout','--connect-timeout','--approval','--auth','--oauth-scope','--oauth-redirect-url','--oauth-client-metadata-url','--ssl-verify','--client-cert','--client-key')
            }
            'mcp login' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--code')
            }
            'mcp logout' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp reload' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'mcp unset' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'transcripts' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'transcripts list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'transcripts show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'transcripts path' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'agent' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-m','--message','--message-file','-t','--to','--session-key','--session-id','--agent','--model','--thinking','--verbose','--channel','--reply-to','--reply-channel','--reply-account','--timeout')
            }
            'agent exec' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','-m','--message','--message-file','-t','--to','--session-key','--session-id','--agent','--model','--thinking','--verbose','--channel','--reply-to','--reply-channel','--reply-account','--timeout','--cwd','--state-dir','--config','--code-mode','--fallback')
            }
            'agents' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'agents list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'agents bindings' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'agents bind' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--bind')
            }
            'agents unbind' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--bind')
            }
            'agents add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--workspace','--model','--agent-dir','--bind')
            }
            'agents set-identity' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--workspace','--identity-file','--name','--theme','--emoji','--avatar')
            }
            'agents delete' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'audit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--session','--run','--execution','--kind','--status','--direction','--channel','--after','--before','--cursor','--limit')
            }
            'status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--timeout')
            }
            'health' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--timeout')
            }
            'sessions' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit')
            }
            'sessions list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit')
            }
            'sessions cleanup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit','--active-key')
            }
            'sessions tail' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit','--session-key','--tail')
            }
            'sessions export-trajectory' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit','--session-key','--output','--workspace','--request-json-base64')
            }
            'sessions archive' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit','--url','--token','--password','--timeout')
            }
            'sessions delete' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit','--url','--token','--password','--timeout')
            }
            'sessions compact' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--store','--agent','--active','--limit','--url','--token','--password','--timeout','--max-lines')
            }
            'tasks' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks audit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status','--severity','--code','--limit')
            }
            'tasks maintenance' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks notify' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks cancel' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks retry' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks dismiss' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks flow' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks flow list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks flow show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'tasks flow cancel' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--runtime','--status')
            }
            'acp' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--token-file','--password','--password-file','--session','--session-label','--provenance')
            }
            'acp client' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--token-file','--password','--password-file','--session','--session-label','--provenance','--cwd','--server','--server-args')
            }
            'gateway' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--url','--timeout')
            }
            'gateway install' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--runtime','--wrapper')
            }
            'gateway uninstall' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway start' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway stop' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway restart' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--wait')
            }
            'gateway restart-handoff' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway restart-handoff capabilities' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway restart-handoff consume' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--expected-pid')
            }
            'gateway auth-token' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway call' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--params','--url','--timeout')
            }
            'gateway suspend' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--request-id','--wait','--url','--timeout')
            }
            'gateway resume' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--url','--timeout')
            }
            'gateway usage-cost' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--days','--agent','--url','--timeout')
            }
            'gateway health' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--url','--timeout')
            }
            'gateway stability' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--limit','--type','--since-seq','--bundle','--output','--url','--timeout')
            }
            'gateway diagnostics' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path')
            }
            'gateway diagnostics export' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--output','--log-lines','--log-bytes','--url','--timeout')
            }
            'gateway probe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--url','--ssh','--ssh-identity','--timeout')
            }
            'gateway discover' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--ws-log','--raw-stream-path','--timeout')
            }
            'daemon' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'daemon status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'daemon install' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--port','--runtime','--token','--wrapper')
            }
            'daemon uninstall' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'daemon start' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'daemon stop' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'daemon restart' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--wait')
            }
            'logs' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--limit','--max-bytes','--interval','--url','--port','--token','--password','--timeout')
            }
            'system' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'system event' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--text','--mode','--session-key','--url','--port','--token','--password','--timeout')
            }
            'system heartbeat' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'system heartbeat last' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'system heartbeat enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'system heartbeat disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'system presence' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'models' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models accounts' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token-file','--password-file','--timeout')
            }
            'models accounts list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token-file','--password-file','--timeout','--cursor')
            }
            'models accounts login' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token-file','--password-file','--timeout','--method')
            }
            'models accounts use' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token-file','--password-file','--timeout')
            }
            'models accounts clear-default' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token-file','--password-file','--timeout')
            }
            'models list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'models status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--probe-provider','--probe-profile','--probe-timeout','--probe-concurrency','--probe-max-tokens')
            }
            'models refresh' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models set-image' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models aliases' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models aliases list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models aliases add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models aliases remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models fallbacks' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models fallbacks list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models fallbacks add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models fallbacks remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models fallbacks clear' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models image-fallbacks' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models image-fallbacks list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models image-fallbacks add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models image-fallbacks remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models image-fallbacks clear' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models scan' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--min-params','--max-age-days','--provider','--max-candidates','--timeout','--concurrency')
            }
            'models auth' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models auth list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'models auth add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models auth logout' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models auth login' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider','--method','--profile-id')
            }
            'models auth setup-token' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'models auth paste-token' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider','--profile-id','--expires-in')
            }
            'models auth paste-api-key' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider','--profile-id')
            }
            'models auth login-github-copilot' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models auth order' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'models auth order get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'models auth order set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'models auth order clear' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'promos' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'promos list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'promos claim' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--api-key')
            }
            'telemetry' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'telemetry show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'telemetry on' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'telemetry off' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer inspect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--name')
            }
            'capability inspect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--name')
            }
            'infer model' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability model' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer model run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--prompt','--file','--model','--thinking')
            }
            'capability model run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--prompt','--file','--model','--thinking')
            }
            'infer model list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability model list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer model inspect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--model')
            }
            'capability model inspect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--model')
            }
            'infer model providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability model providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer model auth' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability model auth' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer model auth login' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider','--method')
            }
            'capability model auth login' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider','--method')
            }
            'infer model auth logout' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'capability model auth logout' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider')
            }
            'infer model auth status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability model auth status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer image' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability image' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer image generate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output')
            }
            'capability image generate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output')
            }
            'infer image edit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output')
            }
            'capability image edit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output')
            }
            'infer image describe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--prompt','--model','--timeout-ms')
            }
            'capability image describe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--prompt','--model','--timeout-ms')
            }
            'infer image describe-many' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--prompt','--model','--timeout-ms')
            }
            'capability image describe-many' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--prompt','--model','--timeout-ms')
            }
            'infer image providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability image providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer audio' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability audio' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer audio transcribe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--language','--prompt','--model')
            }
            'capability audio transcribe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--language','--prompt','--model')
            }
            'infer audio providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability audio providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer tts' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability tts' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer tts convert' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--text','--channel','--voice','--provider','--model','--output')
            }
            'capability tts convert' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--text','--channel','--voice','--provider','--model','--output')
            }
            'infer tts voices' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--provider')
            }
            'capability tts voices' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--provider')
            }
            'infer tts providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability tts providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer tts personas' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability tts personas' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer tts status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability tts status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer tts enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability tts enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer tts disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability tts disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer tts set-provider' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--provider')
            }
            'capability tts set-provider' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--provider')
            }
            'infer tts set-persona' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--persona')
            }
            'capability tts set-persona' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--persona')
            }
            'infer video' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability video' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer video generate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--prompt','--model','--size','--aspect-ratio','--resolution','--duration','--timeout-ms','--output')
            }
            'capability video generate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--prompt','--model','--size','--aspect-ratio','--resolution','--duration','--timeout-ms','--output')
            }
            'infer video describe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--model')
            }
            'capability video describe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--file','--model')
            }
            'infer video providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability video providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer web' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'capability web' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'infer web search' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--query','--provider','--limit')
            }
            'capability web search' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--query','--provider','--limit')
            }
            'infer web fetch' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--provider','--format')
            }
            'capability web fetch' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--provider','--format')
            }
            'infer web providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability web providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer embedding' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability embedding' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'infer embedding create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--text','--provider','--model')
            }
            'capability embedding create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--text','--provider','--model')
            }
            'infer embedding providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'capability embedding providers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'approvals' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'exec-approvals' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'approvals pending' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'exec-approvals pending' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'approvals resolve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--reason','--expires-in-days','--url','--token','--timeout')
            }
            'exec-approvals resolve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--reason','--expires-in-days','--url','--token','--timeout')
            }
            'approvals grants' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'exec-approvals grants' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'approvals grants list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--limit','--url','--token','--timeout')
            }
            'exec-approvals grants list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--limit','--url','--token','--timeout')
            }
            'approvals grants revoke' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'exec-approvals grants revoke' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'approvals get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--url','--token','--timeout')
            }
            'exec-approvals get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--url','--token','--timeout')
            }
            'approvals set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--file','--url','--token','--timeout')
            }
            'exec-approvals set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--file','--url','--token','--timeout')
            }
            'approvals allowlist' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'exec-approvals allowlist' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'approvals allowlist add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--agent','--url','--token','--timeout')
            }
            'exec-approvals allowlist add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--agent','--url','--token','--timeout')
            }
            'approvals allowlist remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--agent','--url','--token','--timeout')
            }
            'exec-approvals allowlist remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--agent','--url','--token','--timeout')
            }
            'exec-policy' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'exec-policy show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'exec-policy preset' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'exec-policy set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--host','--security','--ask','--ask-fallback')
            }
            'nodes' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'nodes status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--last-connected','--url','--token','--timeout')
            }
            'nodes describe' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--url','--token','--timeout')
            }
            'nodes list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--last-connected','--url','--token','--timeout')
            }
            'nodes pending' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'nodes approve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'nodes reject' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'nodes remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--url','--token','--timeout')
            }
            'nodes rename' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--name','--url','--token','--timeout')
            }
            'nodes invoke' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--command','--params','--invoke-timeout','--idempotency-key','--url','--token','--timeout')
            }
            'nodes notify' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--title','--body','--sound','--priority','--delivery','--invoke-timeout','--url','--token','--timeout')
            }
            'nodes push' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--title','--body','--environment','--url','--token','--timeout')
            }
            'nodes camera' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'nodes camera list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--url','--token','--timeout')
            }
            'nodes camera snap' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--facing','--device-id','--max-width','--quality','--delay-ms','--invoke-timeout','--url','--token','--timeout')
            }
            'nodes camera clip' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--facing','--device-id','--duration','--invoke-timeout','--url','--token','--timeout')
            }
            'nodes screen' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'nodes screen record' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--screen','--duration','--fps','--out','--invoke-timeout','--url','--token','--timeout')
            }
            'nodes location' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'nodes location get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--node','--max-age','--accuracy','--location-timeout','--invoke-timeout','--url','--token','--timeout')
            }
            'devices' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'devices list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--timeout')
            }
            'devices join-code' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--timeout')
            }
            'devices remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--timeout')
            }
            'devices clear' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--timeout')
            }
            'devices approve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--timeout')
            }
            'devices reject' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--timeout')
            }
            'devices rename' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--device','--name','--url','--token','--password','--timeout')
            }
            'devices rotate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--device','--role','--scope','--url','--token','--password','--timeout')
            }
            'devices revoke' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--device','--role','--url','--token','--password','--timeout')
            }
            'users' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'users list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--timeout')
            }
            'users link-email' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--to','--url','--token','--timeout')
            }
            'node' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node worker' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--pair','--host','--port','--context-path','--tls-fingerprint','--node-id','--display-name')
            }
            'node status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node identity' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node install' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--host','--port','--context-path','--tls-fingerprint','--node-id','--display-name','--runtime')
            }
            'node uninstall' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node stop' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node start' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'node restart' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'connect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--target-file','--display-name')
            }
            'worker' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'sandbox' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'sandbox list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'sandbox recreate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--session','--agent')
            }
            'sandbox explain' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--session','--agent')
            }
            'fleet' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--image','--runtime','--port','--memory','--cpus','--disk','--network','--pids-limit','--env','--gateway-token')
            }
            'fleet backup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--out','--max-bytes')
            }
            'fleet restore' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from','--max-bytes')
            }
            'fleet doctor' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet ls' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet logs' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--tail','--since')
            }
            'fleet start' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet stop' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet restart' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'fleet upgrade' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--image')
            }
            'fleet rm' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'worktrees' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'worktrees list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'worktrees create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--name','--base-ref')
            }
            'worktrees remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'worktrees restore' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'worktrees gc' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'attach' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--session','--url','--token','--password','--tls-fingerprint','--ttl','--bin')
            }
            'resume' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--handoff','--url','--token','--password','--tls-fingerprint')
            }
            'tui' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--tls-fingerprint','--session','--thinking','--message','--timeout-ms','--history-limit')
            }
            'terminal' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--tls-fingerprint','--session','--thinking','--message','--timeout-ms','--history-limit')
            }
            'chat' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--token','--password','--tls-fingerprint','--session','--thinking','--message','--timeout-ms','--history-limit')
            }
            'cron' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--agent')
            }
            'automations list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--agent')
            }
            'cron add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--name','--display-name','--description','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--trigger-script','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--tools','--webhook','--channel','--to','--thread-id','--account','--declaration-key')
            }
            'cron create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--name','--display-name','--description','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--trigger-script','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--tools','--webhook','--channel','--to','--thread-id','--account','--declaration-key')
            }
            'automations add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--name','--display-name','--description','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--trigger-script','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--tools','--webhook','--channel','--to','--thread-id','--account','--declaration-key')
            }
            'automations create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--name','--display-name','--description','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--trigger-script','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--tools','--webhook','--channel','--to','--thread-id','--account','--declaration-key')
            }
            'cron rm' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron delete' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations rm' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations delete' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'automations show' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'cron runs' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--id','--run-id','--limit')
            }
            'automations runs' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--id','--run-id','--limit')
            }
            'cron run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--wait-timeout','--poll-interval')
            }
            'automations run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--wait-timeout','--poll-interval')
            }
            'cron scratch' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--set','--file','--expected-revision')
            }
            'automations scratch' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--set','--file','--expected-revision')
            }
            'cron edit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--name','--display-name','--description','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--trigger-script','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--tools','--webhook','--channel','--to','--thread-id','--account','--failure-alert-after','--failure-alert-channel','--failure-alert-to','--failure-alert-cooldown','--failure-alert-mode','--failure-alert-account-id')
            }
            'automations edit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout','--name','--display-name','--description','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--trigger-script','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--tools','--webhook','--channel','--to','--thread-id','--account','--failure-alert-after','--failure-alert-channel','--failure-alert-to','--failure-alert-cooldown','--failure-alert-mode','--failure-alert-account-id')
            }
            'dns' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'dns setup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--domain')
            }
            'docs' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'proxy' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'proxy start' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--host','--port')
            }
            'proxy run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--host','--port')
            }
            'proxy validate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--proxy-url','--proxy-ca-file','--allowed-url','--denied-url','--apns-authority','--timeout-ms')
            }
            'proxy coverage' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'proxy sessions' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--limit')
            }
            'proxy query' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--preset','--session')
            }
            'proxy blob' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--id')
            }
            'proxy purge' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'hooks' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks info' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks check' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks relay' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--provider','--relay-id','--state-db','--generation','--event','--pre-tool-use-unavailable','--timeout')
            }
            'hooks install' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'hooks update' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'webhooks' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'webhooks gmail' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'webhooks gmail setup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--account','--project','--topic','--subscription','--label','--hook-url','--hook-token','--push-token','--bind','--port','--path','--max-bytes','--renew-minutes','--tailscale','--tailscale-path','--tailscale-target','--push-endpoint')
            }
            'webhooks gmail run' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--account','--topic','--subscription','--label','--hook-url','--hook-token','--push-token','--bind','--port','--path','--max-bytes','--renew-minutes','--tailscale','--tailscale-path','--tailscale-target')
            }
            'qr' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--public-url','--token','--password')
            }
            'clawbot' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'clawbot qr' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--public-url','--token','--password')
            }
            'pairing' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'pairing list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account')
            }
            'pairing approve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account')
            }
            'plugins' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins search' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--limit')
            }
            'plugins inspect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins info' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins uninstall' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins install' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--marketplace')
            }
            'plugins update' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins registry' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins doctor' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins build' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--root','--entry')
            }
            'plugins validate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--root','--entry')
            }
            'plugins pack' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--root','--out')
            }
            'plugins init' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--directory','--name','--type')
            }
            'plugins marketplace' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'plugins marketplace entries' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--feed-profile','--feed-url')
            }
            'plugins marketplace refresh' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--feed-profile','--feed-url','--expected-sha256')
            }
            'plugins marketplace list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'channels' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'channels list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'channels status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--timeout')
            }
            'channels capabilities' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--account','--target','--timeout')
            }
            'channels resolve' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--account','--kind')
            }
            'channels logs' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--lines')
            }
            'channels dead-letters' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--account')
            }
            'channels dead-letters list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--account','--channel','--limit')
            }
            'channels dead-letters resubmit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--account','--channel')
            }
            'channels add' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--account','--name','--advertised-url','--peer-name','--peer-token','--token','--token-file','--audience-type','--audience','--webhook-path','--webhook-url','--private-key','--relay-urls','--relay-url','--bot-token','--http-url','--base-url','--url','--secret','--password','--secret-file','--homeserver','--user-id','--access-token','--device-name','--avatar-url','--initial-sync-limit','--proxy','--channel-access-token','--channel-secret','--code','--workspace','--default-to','--allow-from','--account-sid','--auth-token','--from-number','--messaging-service-sid','--public-webhook-url','--dm-policy','--ship','--group-channels','--dm-allowlist','--owner-ship','--cli-path','--db-path','--service','--region','--host','--port','--nick','--username','--realname','--channels','--signal-number','--signal-transport','--http-host','--http-port','--app-token','--user-token','--signing-secret','--identity','--mode','--auth-dir')
            }
            'channels remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--account')
            }
            'channels login' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--account')
            }
            'channels logout' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--channel','--account')
            }
            'directory' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'directory self' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account')
            }
            'directory peers' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'directory peers list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account','--query','--limit')
            }
            'directory groups' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'directory groups list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--account','--query','--limit')
            }
            'directory groups members' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--group-id','--channel','--account','--limit')
            }
            'security' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'security audit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--auth','--token','--password')
            }
            'secrets' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'secrets store' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'secrets store list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--scope')
            }
            'secrets store set' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--value','--value-file','--kind','--allow-host','--scope')
            }
            'secrets store get' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--scope')
            }
            'secrets store rm' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--scope')
            }
            'secrets store import' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from','--kind','--scope')
            }
            'secrets reload' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--url','--port','--token','--password','--timeout')
            }
            'secrets audit' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level')
            }
            'secrets configure' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--plan-out')
            }
            'secrets apply' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--from')
            }
            'skills' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills library' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout')
            }
            'skills library list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--scope','--session')
            }
            'skills library read' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--revision','--session')
            }
            'skills library create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--slug')
            }
            'skills library update' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision','--slug','--delete-file')
            }
            'skills library import' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--slug','--version')
            }
            'skills library remove' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision')
            }
            'skills library share' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision')
            }
            'skills library unshare' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision')
            }
            'skills library transfer' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision')
            }
            'skills library enable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision')
            }
            'skills library disable' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision')
            }
            'skills library rollback' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--expected-revision','--revision')
            }
            'skills library attach' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--session','--skill-id','--revision')
            }
            'skills library detach' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--session','--skill-id')
            }
            'skills library refresh' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--url','--port','--token','--password','--timeout','--session','--skill-id')
            }
            'skills search' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--limit')
            }
            'skills install' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--version','--as')
            }
            'skills update' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills verify' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--version','--tag')
            }
            'skills curator' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills curator status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills curator pin' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills curator unpin' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills curator restore' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills workshop' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills workshop list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills workshop inspect' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills workshop propose-create' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--name','--description','--proposal','--proposal-dir','--goal','--evidence')
            }
            'skills workshop propose-update' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--proposal','--proposal-dir','--description','--goal','--evidence')
            }
            'skills workshop revise' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--proposal','--proposal-dir','--description','--goal','--evidence')
            }
            'skills workshop evaluate' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--correlation-id')
            }
            'skills workshop apply' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills workshop reject' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--reason')
            }
            'skills workshop quarantine' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent','--reason')
            }
            'skills list' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills info' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'skills check' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--agent')
            }
            'update' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--tag','--timeout')
            }
            'update cleanup' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--tag','--timeout')
            }
            'update repair' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--tag','--timeout')
            }
            'update finalize' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--tag','--timeout')
            }
            'update wizard' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--tag','--timeout')
            }
            'update status' {
                $commandPath = $candidatePath
                $valueOptions = @('--container','--profile','--log-level','--channel','--tag','--timeout')
            }
        }
    }

    if ($previousElement -match '^-[^-].+$') {
        $shortGroup = $previousElement.Substring(1)
        for ($shortIndex = 0; $shortIndex -lt $shortGroup.Length; $shortIndex++) {
            $shortFlag = "-$($shortGroup[$shortIndex])"
            if ($valueOptions -contains $shortFlag) {
                if ($shortIndex -eq $shortGroup.Length - 1) {
                    $choiceFlag = $shortFlag
                }
                break
            }
        }
    }

    if ($wordToComplete -match '^-[^-].+$') {
        $shortGroup = $wordToComplete.Substring(1)
        for ($shortIndex = 0; $shortIndex -lt $shortGroup.Length; $shortIndex++) {
            $shortFlag = "-$($shortGroup[$shortIndex])"
            if ($valueOptions -contains $shortFlag) {
                $choiceFlag = $shortFlag
                $choicePrefix = $shortGroup.Substring($shortIndex + 1)
                $choiceCompletionPrefix = "-$($shortGroup.Substring(0, $shortIndex + 1))"
                break
            }
        }
    }

    if ($commandPath -eq 'completion') {
        if ($choiceFlag -in @('-s','--shell')) {
            $matchingChoices = @(@('zsh','bash','powershell','fish') | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if ($true) {
                return
            }
        }
    }
    if ($commandPath -eq 'nodes notify') {
        if ($choiceFlag -in @('--priority')) {
            $matchingChoices = @(@('passive','active','timeSensitive') | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if ($true) {
                return
            }
        }
        if ($choiceFlag -in @('--delivery')) {
            $matchingChoices = @(@('system','overlay','auto') | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if ($true) {
                return
            }
        }
    }
    if ($commandPath -eq 'channels resolve') {
        if ($choiceFlag -in @('--kind')) {
            $matchingChoices = @(@('auto','user','group','channel') | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if ($true) {
                return
            }
        }
    }
    if ($commandPath -eq 'skills library list') {
        if ($choiceFlag -in @('--scope')) {
            $matchingChoices = @(@('mine','team','all') | Where-Object {
                $_.StartsWith($choicePrefix, [StringComparison]::OrdinalIgnoreCase)
            })
            $matchingChoices | ForEach-Object {
                $choiceValue = if ($_ -match '^[A-Za-z0-9_./:+-]+$') {
                    $_
                } else {
                    "'" + $_.Replace("'", "''") + "'"
                }
                $completionText = "$choiceCompletionPrefix$choiceValue"
                [System.Management.Automation.CompletionResult]::new($completionText, $_, 'ParameterValue', $_)
            }
            if ($true) {
                return
            }
        }
    }
    
    # Root command
    if ($commandPath -eq "") {
         $completions = @('acp','agent','agents','approvals','exec-approvals','attach','audit','backup','channels','clawbot','completion','config','configure','connect','cron','automations','daemon','dashboard','database','devices','directory','dns','docs','doctor','exec-policy','fleet','gateway','health','hooks','infer','capability','logs','mcp','message','migrate','models','node','nodes','onboard','pairing','plugins','promos','proxy','qr','reset','resume','sandbox','secrets','security','sessions','setup','skills','status','system','tasks','telemetry','transcripts','triage','tui','terminal','chat','uninstall','update','users','webhooks','worker','worktrees','-V','--version','--container','--dev','--profile','--log-level','--no-color')
         $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
         }
    }
    
    
            if ($commandPath -eq 'completion') {
                $completions = @('-s','--shell','-i','--install','--write-state','-y','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'setup') {
                $completions = @('--workspace','--agent-name','--wizard','--baseline','--reset','--reset-scope','--non-interactive','--classic','--tui','--accept-risk','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--custom-image-input','--custom-text-input','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--tailscale','--install-daemon','--no-install-daemon','--skip-daemon','--daemon-runtime','--skip-channels','--skip-skills','--skip-bootstrap','--skip-search','--skip-health','--skip-ui','--suppress-gateway-token-output','--skip-hooks','--node-manager','--import-from','--import-source','--import-secrets','--remote-url','--remote-token','--remote-password','-m','--message','--yes','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'crestodian') {
                $completions = @('-m','--message','--yes','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'onboard') {
                $completions = @('recommendations','--workspace','--agent-name','--reset','--reset-scope','--non-interactive','--modern','--classic','--tui','--accept-risk','--flow','--mode','--auth-choice','--token-provider','--token','--token-profile-id','--token-expires-in','--secret-input-mode','--cloudflare-ai-gateway-account-id','--cloudflare-ai-gateway-gateway-id','--alibaba-model-studio-api-key','--anthropic-api-key','--clawrouter-api-key','--fal-api-key','--github-copilot-token','--gemini-api-key','--huggingface-api-key','--litellm-api-key','--lmstudio-api-key','--minimax-api-key','--nvidia-api-key','--ollama-cloud-api-key','--openai-api-key','--opencode-go-api-key','--openrouter-api-key','--runway-api-key','--together-api-key','--xai-api-key','--kimi-code-api-key','--moonshot-api-key','--arceeai-api-key','--baseten-api-key','--byteplus-api-key','--cerebras-api-key','--chutes-api-key','--cohere-api-key','--cloudflare-ai-gateway-api-key','--comfy-api-key','--deepinfra-api-key','--deepseek-api-key','--featherless-api-key','--gmi-api-key','--longcat-api-key','--meta-api-key','--mistral-api-key','--novita-api-key','--opencode-zen-api-key','--groq-api-key','--kilocode-api-key','--pixverse-api-key','--qianfan-api-key','--modelstudio-standard-api-key-cn','--modelstudio-standard-api-key','--modelstudio-api-key-cn','--modelstudio-api-key','--qwen-token-plan-api-key','--qwen-token-plan-api-key-cn','--fireworks-api-key','--tokenhub-api-key','--tokenplan-api-key','--venice-api-key','--ai-gateway-api-key','--vydra-api-key','--xiaomi-api-key','--xiaomi-token-plan-api-key','--zai-api-key','--synthetic-api-key','--volcengine-api-key','--stepfun-api-key','--custom-base-url','--custom-api-key','--custom-model-id','--custom-provider-id','--custom-compatibility','--custom-image-input','--custom-text-input','--gateway-port','--gateway-bind','--gateway-auth','--gateway-token','--gateway-token-ref-env','--gateway-password','--remote-url','--remote-token','--remote-password','--tailscale','--install-daemon','--no-install-daemon','--skip-daemon','--daemon-runtime','--skip-channels','--skip-skills','--skip-bootstrap','--skip-search','--skip-health','--skip-ui','--suppress-gateway-token-output','--skip-hooks','--node-manager','--import-from','--import-source','--import-secrets','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'onboard recommendations') {
                $completions = @('acknowledge','refresh','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'onboard recommendations acknowledge') {
                $completions = @('--retry')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'configure') {
                $completions = @('--section')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config') {
                $completions = @('file','get','patch','schema','set','unset','validate','--section')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config get') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config set') {
                $completions = @('--strict-json','--json','--expect-current-absent','--expect-current-json','--dry-run','--allow-exec','--merge','--replace','--ref-provider','--ref-source','--ref-id','--provider-source','--provider-allowlist','--provider-path','--provider-mode','--provider-timeout-ms','--provider-max-bytes','--provider-command','--provider-arg','--provider-no-output-timeout-ms','--provider-max-output-bytes','--provider-json-only','--provider-env','--provider-pass-env','--provider-trusted-dir','--batch-json','--batch-file')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config patch') {
                $completions = @('--file','--stdin','--dry-run','--allow-exec','--json','--replace-path')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config unset') {
                $completions = @('--dry-run','--allow-exec','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config file') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config schema') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'config validate') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup') {
                $completions = @('create','disable','enable','git','restore','sqlite','verify')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup create') {
                $completions = @('--output','--json','--dry-run','--verify','--only-config','--no-include-workspace')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup verify') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup restore') {
                $completions = @('--target','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup sqlite') {
                $completions = @('create','list','restore','verify')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup sqlite create') {
                $completions = @('--global','--agent','--repository','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup sqlite list') {
                $completions = @('--repository','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup sqlite verify') {
                $completions = @('--scratch','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup sqlite restore') {
                $completions = @('--target','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup git') {
                $completions = @('create','init','log','restore','verify')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup git init') {
                $completions = @('--repository','--remote','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup git create') {
                $completions = @('--repository','--all','--global','--agent','--push','--exclude-secrets','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup git log') {
                $completions = @('--repository','--limit','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup git verify') {
                $completions = @('--repository','--ref','--global','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup git restore') {
                $completions = @('--repository','--target','--ref','--global','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup enable') {
                $completions = @('--repository','--every','--push','--exclude-secrets','--include-secrets','--global-only','--agent','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'backup disable') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'database') {
                $completions = @('ownership','preflight')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'database preflight') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'database ownership') {
                $completions = @('claim','status')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'database ownership status') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'database ownership claim') {
                $completions = @('--manager','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'migrate') {
                $completions = @('apply','list','plan','--from','--agent','--include-secrets','--no-auth-credentials','--overwrite','--dry-run','--yes','--skill','--plugin','--item','--backup-output','--no-backup','--force','--json','--verify-plugin-apps')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'migrate list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'migrate plan') {
                $completions = @('--from','--agent','--include-secrets','--no-auth-credentials','--overwrite','--json','--skill','--plugin','--item','--verify-plugin-apps')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'migrate apply') {
                $completions = @('--from','--agent','--include-secrets','--no-auth-credentials','--overwrite','--json','--skill','--plugin','--item','--verify-plugin-apps','--yes','--backup-output','--no-backup','--force')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'doctor') {
                $completions = @('--no-workspace-suggestions','--yes','--repair','--fix','--force','--non-interactive','--generate-gateway-token','--allow-exec','--deep','--lint','--post-upgrade','--session-sqlite','--state-sqlite','--session-sqlite-store','--session-sqlite-agent','--session-sqlite-all-agents','--github-issue','--json','--severity-min','--all','--skip','--only')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'triage') {
                $completions = @('--json','--no-export','--agent','--run','--non-interactive','--update-result')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'dashboard') {
                $completions = @('--no-open','--json','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'reset') {
                $completions = @('--scope','--yes','--non-interactive','--dry-run')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'uninstall') {
                $completions = @('--service','--state','--workspace','--app','--all','--yes','--non-interactive','--dry-run')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message') {
                $completions = @('ban','broadcast','channel','delete','edit','emoji','event','kick','member','permissions','pin','pins','poll','react','reactions','read','role','search','send','sticker','thread','timeout','unpin','voice')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message send') {
                $completions = @('-m','--message','-t','--target','--media','--presentation','--delivery','--pin','--reply-to','--thread-id','--gif-playback','--force-document','--silent','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message broadcast') {
                $completions = @('--channel','--account','--json','--dry-run','--verbose','--targets','--message','--media')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message poll') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--poll-question','--poll-option','--poll-multi','--poll-duration-hours','--poll-duration-seconds','--poll-anonymous','--poll-public','-m','--message','--silent','--thread-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message react') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--message-id','--emoji','--remove','--participant','--from-me','--target-author','--target-author-uuid')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message reactions') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--message-id','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message read') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--limit','--message-id','--before','--after','--around','--thread-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message edit') {
                $completions = @('--message-id','-m','--message','-t','--target','--channel','--account','--json','--dry-run','--verbose','--thread-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message delete') {
                $completions = @('--message-id','-t','--target','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message pin') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--message-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message unpin') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--message-id','--pinned-message-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message pins') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message permissions') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message search') {
                $completions = @('--channel','--account','--json','--dry-run','--verbose','--guild-id','--query','--channel-id','--channel-ids','--author-id','--author-ids','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message thread') {
                $completions = @('create','list','reply')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message thread create') {
                $completions = @('--thread-name','-t','--target','--channel','--account','--json','--dry-run','--verbose','--message-id','-m','--message','--auto-archive-min')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message thread list') {
                $completions = @('--guild-id','--channel','--account','--json','--dry-run','--verbose','--channel-id','--include-archived','--before','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message thread reply') {
                $completions = @('-m','--message','-t','--target','--channel','--account','--json','--dry-run','--verbose','--media','--reply-to')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message emoji') {
                $completions = @('list','upload')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message emoji list') {
                $completions = @('--channel','--account','--json','--dry-run','--verbose','--guild-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message emoji upload') {
                $completions = @('--guild-id','--channel','--account','--json','--dry-run','--verbose','--emoji-name','--media','--role-ids')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message sticker') {
                $completions = @('send','upload')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message sticker send') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose','--sticker-id','-m','--message')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message sticker upload') {
                $completions = @('--guild-id','--channel','--account','--json','--dry-run','--verbose','--sticker-name','--sticker-desc','--sticker-tags','--media')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message role') {
                $completions = @('add','info','remove')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message role info') {
                $completions = @('--guild-id','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message role add') {
                $completions = @('--guild-id','--user-id','--role-id','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message role remove') {
                $completions = @('--guild-id','--user-id','--role-id','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message channel') {
                $completions = @('info','list')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message channel info') {
                $completions = @('-t','--target','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message channel list') {
                $completions = @('--guild-id','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message member') {
                $completions = @('info')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message member info') {
                $completions = @('--user-id','--channel','--account','--json','--dry-run','--verbose','--guild-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message voice') {
                $completions = @('status')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message voice status') {
                $completions = @('--guild-id','--user-id','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message event') {
                $completions = @('create','list')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message event list') {
                $completions = @('--guild-id','--channel','--account','--json','--dry-run','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message event create') {
                $completions = @('--guild-id','--event-name','--start-time','--channel','--account','--json','--dry-run','--verbose','--end-time','--desc','--channel-id','--location','--event-type','--image')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message timeout') {
                $completions = @('--guild-id','--user-id','--channel','--account','--json','--dry-run','--verbose','--duration-min','--until','--reason')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message kick') {
                $completions = @('--guild-id','--user-id','--channel','--account','--json','--dry-run','--verbose','--reason')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'message ban') {
                $completions = @('--guild-id','--user-id','--channel','--account','--json','--dry-run','--verbose','--reason','--delete-days')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp') {
                $completions = @('add','configure','doctor','list','login','logout','probe','reload','serve','set','show','status','tools','unset')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp serve') {
                $completions = @('--url','--token','--token-file','--password','--password-file','--claude-channel-mode','-v','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp show') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp status') {
                $completions = @('-v','--verbose','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp probe') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp doctor') {
                $completions = @('--probe','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp add') {
                $completions = @('--command','--arg','--env','--cwd','--url','--transport','--header','--auth','--oauth-scope','--oauth-redirect-url','--oauth-client-metadata-url','--include','--exclude','--timeout','--connect-timeout','--parallel','--approval','--disabled','--ssl-verify','--client-cert','--client-key','--no-probe')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp tools') {
                $completions = @('--include','--exclude','--clear')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp configure') {
                $completions = @('--enable','--disable','--include','--exclude','--clear-tools','--timeout','--connect-timeout','--clear-timeouts','--parallel','--no-parallel','--approval','--auth','--clear-auth','--oauth-scope','--oauth-redirect-url','--oauth-client-metadata-url','--ssl-verify','--client-cert','--client-key','--clear-tls','--probe')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'mcp login') {
                $completions = @('--code')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'transcripts') {
                $completions = @('list','path','show')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'transcripts list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'transcripts show') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'transcripts path') {
                $completions = @('--dir','--metadata','--transcript','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agent') {
                $completions = @('exec','-m','--message','--message-file','-t','--to','--session-key','--session-id','--agent','--model','--thinking','--verbose','--channel','--reply-to','--reply-channel','--reply-account','--local','--deliver','--json','--timeout')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agent exec') {
                $completions = @('--message-file','--cwd','--state-dir','--config','--isolated','--model','--code-mode','--local-model-lean','--thinking','--fallback','--auth-env-only','--no-auth-env-only','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents') {
                $completions = @('add','bind','bindings','delete','list','set-identity','unbind')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents list') {
                $completions = @('--json','--bindings','--tree')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents bindings') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents bind') {
                $completions = @('--agent','--bind','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents unbind') {
                $completions = @('--agent','--bind','--all','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents add') {
                $completions = @('--workspace','--model','--agent-dir','--bind','--non-interactive','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents set-identity') {
                $completions = @('--agent','--workspace','--identity-file','--from-identity','--name','--theme','--emoji','--avatar','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'agents delete') {
                $completions = @('--force','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'audit') {
                $completions = @('--agent','--session','--run','--execution','--kind','--status','--direction','--channel','--after','--before','--cursor','--limit','--explain','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'status') {
                $completions = @('--json','--all','--usage','--agent','--deep','--timeout','--verbose','--debug')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'health') {
                $completions = @('--json','--timeout','--verbose','--debug')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions') {
                $completions = @('archive','cleanup','compact','delete','export-trajectory','list','tail','--json','--verbose','--store','--agent','--all-agents','--active','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions list') {
                $completions = @('--json','--verbose','--store','--agent','--all-agents','--active','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions cleanup') {
                $completions = @('--store','--agent','--all-agents','--dry-run','--enforce','--fix-missing','--fix-dm-scope','--active-key','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions tail') {
                $completions = @('--session-key','--tail','--follow','--store','--agent','--all-agents')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions export-trajectory') {
                $completions = @('--session-key','--output','--workspace','--store','--agent','--request-json-base64','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions archive') {
                $completions = @('--dry-run','--agent','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions delete') {
                $completions = @('--dry-run','--yes','--agent','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sessions compact') {
                $completions = @('--agent','--url','--token','--password','--timeout','--json','--max-lines')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks') {
                $completions = @('audit','cancel','dismiss','flow','list','maintenance','notify','retry','show','--json','--runtime','--status')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks list') {
                $completions = @('--json','--runtime','--status')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks audit') {
                $completions = @('--json','--severity','--code','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks maintenance') {
                $completions = @('--json','--apply')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks show') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks flow') {
                $completions = @('cancel','list','show','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks flow list') {
                $completions = @('--json','--status')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tasks flow show') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'acp') {
                $completions = @('client','--url','--token','--token-file','--password','--password-file','--session','--session-label','--require-existing','--reset-session','--no-prefix-cwd','--provenance','-v','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'acp client') {
                $completions = @('--cwd','--server','--server-args','--server-verbose','-v','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway') {
                $completions = @('auth-token','call','diagnostics','discover','health','install','probe','restart','resume','run','stability','start','status','stop','suspend','uninstall','usage-cost','--port','--bind','--token','--auth','--password','--password-file','--tailscale','--allow-unconfigured','--dev','--ambient-channels','--dev-ambient-channels','--reset','--force','--verbose','--cli-backend-logs','--claude-cli-logs','--ws-log','--compact','--raw-stream','--raw-stream-path')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway run') {
                $completions = @('--port','--bind','--token','--auth','--password','--password-file','--tailscale','--allow-unconfigured','--dev','--ambient-channels','--dev-ambient-channels','--reset','--force','--verbose','--cli-backend-logs','--claude-cli-logs','--ws-log','--compact','--raw-stream','--raw-stream-path')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway status') {
                $completions = @('--url','--port','--token','--password','--timeout','--no-probe','--require-rpc','--deep','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway install') {
                $completions = @('--port','--runtime','--token','--wrapper','--force','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway uninstall') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway start') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway stop') {
                $completions = @('--force','--json','--disable')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway restart') {
                $completions = @('--preserve-definition','--force','--safe','--skip-deferral','--wait','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway restart-handoff') {
                $completions = @('capabilities','consume')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway restart-handoff capabilities') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway restart-handoff consume') {
                $completions = @('--expected-pid','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway auth-token') {
                $completions = @('--show')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway call') {
                $completions = @('--params','--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway suspend') {
                $completions = @('--request-id','--wait','--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway resume') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway usage-cost') {
                $completions = @('--days','--agent','--all-agents','--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway health') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway stability') {
                $completions = @('--limit','--type','--since-seq','--bundle','--export','--output','--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway diagnostics') {
                $completions = @('export')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway diagnostics export') {
                $completions = @('--output','--log-lines','--log-bytes','--url','--token','--password','--timeout','--no-stability-bundle','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway probe') {
                $completions = @('--url','--port','--ssh','--ssh-identity','--ssh-auto','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'gateway discover') {
                $completions = @('--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon') {
                $completions = @('install','restart','start','status','stop','uninstall','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon status') {
                $completions = @('--url','--port','--token','--password','--timeout','--no-probe','--require-rpc','--deep','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon install') {
                $completions = @('--port','--runtime','--token','--wrapper','--force','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon uninstall') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon start') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon stop') {
                $completions = @('--force','--json','--disable')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'daemon restart') {
                $completions = @('--preserve-definition','--force','--safe','--skip-deferral','--wait','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'logs') {
                $completions = @('--limit','--max-bytes','--follow','--interval','--json','--plain','--no-color','--local-time','--utc','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system') {
                $completions = @('event','heartbeat','presence')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system event') {
                $completions = @('--text','--mode','--session-key','--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system heartbeat') {
                $completions = @('disable','enable','last')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system heartbeat last') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system heartbeat enable') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system heartbeat disable') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'system presence') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models') {
                $completions = @('accounts','aliases','auth','fallbacks','image-fallbacks','list','refresh','scan','set','set-image','status','--json','--status-json','--status-plain','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models accounts') {
                $completions = @('clear-default','list','login','use','--url','--port','--token-file','--password-file','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models accounts list') {
                $completions = @('--url','--port','--token-file','--password-file','--timeout','--json','--cursor')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models accounts login') {
                $completions = @('--url','--port','--token-file','--password-file','--timeout','--json','--method')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models accounts use') {
                $completions = @('--url','--port','--token-file','--password-file','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models accounts clear-default') {
                $completions = @('--url','--port','--token-file','--password-file','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models list') {
                $completions = @('--all','--local','--provider','--agent','--json','--plain')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models status') {
                $completions = @('--json','--plain','--check','--probe','--probe-provider','--probe-profile','--probe-timeout','--probe-concurrency','--probe-max-tokens','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models refresh') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models aliases') {
                $completions = @('add','list','remove')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models aliases list') {
                $completions = @('--json','--plain')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models fallbacks') {
                $completions = @('add','clear','list','remove')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models fallbacks list') {
                $completions = @('--json','--plain')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models image-fallbacks') {
                $completions = @('add','clear','list','remove')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models image-fallbacks list') {
                $completions = @('--json','--plain')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models scan') {
                $completions = @('--min-params','--max-age-days','--provider','--max-candidates','--timeout','--concurrency','--no-probe','--yes','--no-input','--set-default','--set-image','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth') {
                $completions = @('add','list','login','login-github-copilot','logout','order','paste-api-key','paste-token','setup-token','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth list') {
                $completions = @('--provider','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth add') {
                $completions = @('--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth logout') {
                $completions = @('--agent','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth login') {
                $completions = @('--agent','--provider','--method','--device-code','--profile-id','--set-default','--force')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth setup-token') {
                $completions = @('--agent','--provider','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth paste-token') {
                $completions = @('--agent','--provider','--profile-id','--expires-in')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth paste-api-key') {
                $completions = @('--agent','--provider','--profile-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth login-github-copilot') {
                $completions = @('--agent','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth order') {
                $completions = @('clear','get','set')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth order get') {
                $completions = @('--provider','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth order set') {
                $completions = @('--provider','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'models auth order clear') {
                $completions = @('--provider','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'promos') {
                $completions = @('claim','list')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'promos list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'promos claim') {
                $completions = @('--api-key','--set-default')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'telemetry') {
                $completions = @('off','on','show')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'telemetry show') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer') {
                $completions = @('audio','embedding','image','inspect','list','model','tts','video','web')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability') {
                $completions = @('audio','embedding','image','inspect','list','model','tts','video','web')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer inspect') {
                $completions = @('--name','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability inspect') {
                $completions = @('--name','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model') {
                $completions = @('auth','inspect','list','providers','run','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model') {
                $completions = @('auth','inspect','list','providers','run','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model run') {
                $completions = @('--prompt','--file','--model','--thinking','--local','--gateway','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model run') {
                $completions = @('--prompt','--file','--model','--thinking','--local','--gateway','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model inspect') {
                $completions = @('--model','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model inspect') {
                $completions = @('--model','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model auth') {
                $completions = @('login','logout','status','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model auth') {
                $completions = @('login','logout','status','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model auth login') {
                $completions = @('--provider','--method','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model auth login') {
                $completions = @('--provider','--method','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model auth logout') {
                $completions = @('--provider','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model auth logout') {
                $completions = @('--provider','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer model auth status') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability model auth status') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer image') {
                $completions = @('describe','describe-many','edit','generate','providers','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability image') {
                $completions = @('describe','describe-many','edit','generate','providers','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer image generate') {
                $completions = @('--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability image generate') {
                $completions = @('--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer image edit') {
                $completions = @('--file','--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability image edit') {
                $completions = @('--file','--prompt','--model','--count','--size','--aspect-ratio','--resolution','--output-format','--background','--openai-background','--openai-moderation','--quality','--timeout-ms','--output','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer image describe') {
                $completions = @('--file','--prompt','--model','--timeout-ms','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability image describe') {
                $completions = @('--file','--prompt','--model','--timeout-ms','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer image describe-many') {
                $completions = @('--file','--prompt','--model','--timeout-ms','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability image describe-many') {
                $completions = @('--file','--prompt','--model','--timeout-ms','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer image providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability image providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer audio') {
                $completions = @('providers','transcribe','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability audio') {
                $completions = @('providers','transcribe','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer audio transcribe') {
                $completions = @('--file','--agent','--language','--prompt','--model','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability audio transcribe') {
                $completions = @('--file','--agent','--language','--prompt','--model','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer audio providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability audio providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts') {
                $completions = @('convert','disable','enable','personas','providers','set-persona','set-provider','status','voices')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts') {
                $completions = @('convert','disable','enable','personas','providers','set-persona','set-provider','status','voices')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts convert') {
                $completions = @('--text','--channel','--voice','--provider','--model','--output','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts convert') {
                $completions = @('--text','--channel','--voice','--provider','--model','--output','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts voices') {
                $completions = @('--provider','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts voices') {
                $completions = @('--provider','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts providers') {
                $completions = @('--agent','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts providers') {
                $completions = @('--agent','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts personas') {
                $completions = @('--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts personas') {
                $completions = @('--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts status') {
                $completions = @('--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts status') {
                $completions = @('--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts enable') {
                $completions = @('--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts enable') {
                $completions = @('--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts disable') {
                $completions = @('--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts disable') {
                $completions = @('--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts set-provider') {
                $completions = @('--provider','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts set-provider') {
                $completions = @('--provider','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer tts set-persona') {
                $completions = @('--persona','--off','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability tts set-persona') {
                $completions = @('--persona','--off','--local','--gateway','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer video') {
                $completions = @('describe','generate','providers','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability video') {
                $completions = @('describe','generate','providers','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer video generate') {
                $completions = @('--prompt','--model','--size','--aspect-ratio','--resolution','--duration','--audio','--watermark','--timeout-ms','--output','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability video generate') {
                $completions = @('--prompt','--model','--size','--aspect-ratio','--resolution','--duration','--audio','--watermark','--timeout-ms','--output','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer video describe') {
                $completions = @('--file','--agent','--model','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability video describe') {
                $completions = @('--file','--agent','--model','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer video providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability video providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer web') {
                $completions = @('fetch','providers','search')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability web') {
                $completions = @('fetch','providers','search')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer web search') {
                $completions = @('--query','--provider','--limit','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability web search') {
                $completions = @('--query','--provider','--limit','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer web fetch') {
                $completions = @('--url','--provider','--format','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability web fetch') {
                $completions = @('--url','--provider','--format','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer web providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability web providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer embedding') {
                $completions = @('create','providers','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability embedding') {
                $completions = @('create','providers','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer embedding create') {
                $completions = @('--text','--provider','--model','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability embedding create') {
                $completions = @('--text','--provider','--model','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'infer embedding providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'capability embedding providers') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals') {
                $completions = @('allowlist','get','grants','pending','resolve','set')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals') {
                $completions = @('allowlist','get','grants','pending','resolve','set')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals pending') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals pending') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals resolve') {
                $completions = @('--reason','--expires-in-days','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals resolve') {
                $completions = @('--reason','--expires-in-days','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals grants') {
                $completions = @('list','revoke')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals grants') {
                $completions = @('list','revoke')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals grants list') {
                $completions = @('--limit','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals grants list') {
                $completions = @('--limit','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals grants revoke') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals grants revoke') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals get') {
                $completions = @('--node','--gateway','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals get') {
                $completions = @('--node','--gateway','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals set') {
                $completions = @('--node','--gateway','--file','--stdin','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals set') {
                $completions = @('--node','--gateway','--file','--stdin','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals allowlist') {
                $completions = @('add','remove')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals allowlist') {
                $completions = @('add','remove')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals allowlist add') {
                $completions = @('--node','--gateway','--agent','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals allowlist add') {
                $completions = @('--node','--gateway','--agent','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'approvals allowlist remove') {
                $completions = @('--node','--gateway','--agent','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-approvals allowlist remove') {
                $completions = @('--node','--gateway','--agent','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-policy') {
                $completions = @('preset','set','show')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-policy show') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-policy preset') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'exec-policy set') {
                $completions = @('--host','--security','--ask','--ask-fallback','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes') {
                $completions = @('approve','camera','describe','invoke','list','location','notify','pending','push','reject','remove','rename','screen','status')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes status') {
                $completions = @('--connected','--last-connected','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes describe') {
                $completions = @('--node','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes list') {
                $completions = @('--connected','--last-connected','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes pending') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes approve') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes reject') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes remove') {
                $completions = @('--node','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes rename') {
                $completions = @('--node','--name','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes invoke') {
                $completions = @('--node','--command','--params','--invoke-timeout','--idempotency-key','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes notify') {
                $completions = @('--node','--title','--body','--sound','--priority','--delivery','--invoke-timeout','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes push') {
                $completions = @('--node','--title','--body','--environment','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes camera') {
                $completions = @('clip','list','snap')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes camera list') {
                $completions = @('--node','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes camera snap') {
                $completions = @('--node','--facing','--device-id','--max-width','--quality','--delay-ms','--invoke-timeout','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes camera clip') {
                $completions = @('--node','--facing','--device-id','--duration','--no-audio','--invoke-timeout','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes screen') {
                $completions = @('record')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes screen record') {
                $completions = @('--node','--screen','--duration','--fps','--no-audio','--out','--invoke-timeout','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes location') {
                $completions = @('get')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'nodes location get') {
                $completions = @('--node','--max-age','--accuracy','--location-timeout','--invoke-timeout','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices') {
                $completions = @('approve','clear','join-code','list','reject','remove','rename','revoke','rotate')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices list') {
                $completions = @('--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices join-code') {
                $completions = @('--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices remove') {
                $completions = @('--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices clear') {
                $completions = @('--pending','--yes','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices approve') {
                $completions = @('--latest','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices reject') {
                $completions = @('--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices rename') {
                $completions = @('--device','--name','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices rotate') {
                $completions = @('--device','--role','--scope','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'devices revoke') {
                $completions = @('--device','--role','--url','--token','--password','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'users') {
                $completions = @('link-email','list')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'users list') {
                $completions = @('--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'users link-email') {
                $completions = @('--to','--url','--token','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node') {
                $completions = @('identity','install','restart','run','start','status','stop','uninstall')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node run') {
                $completions = @('--pair','--host','--port','--context-path','--tls','--no-tls','--tls-fingerprint','--node-id','--display-name','--share-installed-apps','--no-share-installed-apps')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node status') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node identity') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node install') {
                $completions = @('--host','--port','--context-path','--tls','--no-tls','--tls-fingerprint','--node-id','--display-name','--share-installed-apps','--no-share-installed-apps','--runtime','--force','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node uninstall') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node stop') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node start') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'node restart') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'connect') {
                $completions = @('--service','--ephemeral','--session-host','--target-file','--display-name')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sandbox') {
                $completions = @('explain','list','recreate')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sandbox list') {
                $completions = @('--json','--browser')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sandbox recreate') {
                $completions = @('--all','--session','--agent','--browser','--force')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'sandbox explain') {
                $completions = @('--session','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet') {
                $completions = @('backup','create','doctor','list','ls','logs','restart','restore','rm','start','status','stop','upgrade')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet create') {
                $completions = @('--image','--runtime','--port','--memory','--cpus','--disk','--network','--pids-limit','--env','--gateway-token','--no-start','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet backup') {
                $completions = @('--out','--max-bytes','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet restore') {
                $completions = @('--from','--force','--max-bytes','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet doctor') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet ls') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet status') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet logs') {
                $completions = @('--follow','--tail','--since')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet upgrade') {
                $completions = @('--image')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'fleet rm') {
                $completions = @('--purge-data','--force')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'worktrees') {
                $completions = @('create','gc','list','remove','restore')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'worktrees list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'worktrees create') {
                $completions = @('--name','--base-ref','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'worktrees remove') {
                $completions = @('--force','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'worktrees restore') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'worktrees gc') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'attach') {
                $completions = @('--session','--url','--token','--password','--tls-fingerprint','--ttl','--bin','--print-config')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'resume') {
                $completions = @('--handoff','--url','--token','--password','--tls-fingerprint')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'tui') {
                $completions = @('--local','--url','--token','--password','--tls-fingerprint','--session','--deliver','--thinking','--message','--timeout-ms','--history-limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'terminal') {
                $completions = @('--local','--url','--token','--password','--tls-fingerprint','--session','--deliver','--thinking','--message','--timeout-ms','--history-limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'chat') {
                $completions = @('--local','--url','--token','--password','--tls-fingerprint','--session','--deliver','--thinking','--message','--timeout-ms','--history-limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron') {
                $completions = @('add','create','disable','edit','enable','get','list','rm','remove','delete','run','runs','scratch','show','status','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations') {
                $completions = @('add','create','disable','edit','enable','get','list','rm','remove','delete','run','runs','scratch','show','status','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron status') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations status') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron list') {
                $completions = @('--all','--agent','--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations list') {
                $completions = @('--all','--agent','--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron add') {
                $completions = @('--json','--name','--display-name','--description','--delete-after-run','--keep-after-run','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--exact','--trigger-script','--trigger-once','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--light-context','--tools','--announce','--deliver','--no-deliver','--webhook','--channel','--to','--thread-id','--account','--best-effort-deliver','--declaration-key','--disabled','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron create') {
                $completions = @('--json','--name','--display-name','--description','--delete-after-run','--keep-after-run','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--exact','--trigger-script','--trigger-once','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--light-context','--tools','--announce','--deliver','--no-deliver','--webhook','--channel','--to','--thread-id','--account','--best-effort-deliver','--declaration-key','--disabled','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations add') {
                $completions = @('--json','--name','--display-name','--description','--delete-after-run','--keep-after-run','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--exact','--trigger-script','--trigger-once','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--light-context','--tools','--announce','--deliver','--no-deliver','--webhook','--channel','--to','--thread-id','--account','--best-effort-deliver','--declaration-key','--disabled','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations create') {
                $completions = @('--json','--name','--display-name','--description','--delete-after-run','--keep-after-run','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--exact','--trigger-script','--trigger-once','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--light-context','--tools','--announce','--deliver','--no-deliver','--webhook','--channel','--to','--thread-id','--account','--best-effort-deliver','--declaration-key','--disabled','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron rm') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron remove') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron delete') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations rm') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations remove') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations delete') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron enable') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations enable') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron disable') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations disable') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron get') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations get') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron show') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations show') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron runs') {
                $completions = @('--json','--id','--run-id','--limit','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations runs') {
                $completions = @('--json','--id','--run-id','--limit','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron run') {
                $completions = @('--json','--due','--wait','--wait-timeout','--poll-interval','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations run') {
                $completions = @('--json','--due','--wait','--wait-timeout','--poll-interval','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron scratch') {
                $completions = @('--json','--set','--file','--unset','--expected-revision','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations scratch') {
                $completions = @('--json','--set','--file','--unset','--expected-revision','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'cron edit') {
                $completions = @('--json','--name','--display-name','--description','--delete-after-run','--keep-after-run','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--exact','--trigger-script','--trigger-once','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--light-context','--tools','--announce','--deliver','--no-deliver','--webhook','--channel','--to','--thread-id','--account','--best-effort-deliver','--clear-display-name','--enable','--disable','--clear-agent','--clear-session-key','--clear-pacing','--clear-trigger','--clear-thinking','--clear-fallbacks','--clear-model','--no-light-context','--clear-tools','--clear-channel','--clear-to','--clear-thread-id','--clear-account','--no-best-effort-deliver','--failure-alert','--no-failure-alert','--failure-alert-after','--failure-alert-channel','--failure-alert-to','--failure-alert-cooldown','--failure-alert-include-skipped','--failure-alert-exclude-skipped','--failure-alert-mode','--failure-alert-account-id','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'automations edit') {
                $completions = @('--json','--name','--display-name','--description','--delete-after-run','--keep-after-run','--agent','--session','--session-key','--wake','--at','--every','--pacing-min','--pacing-max','--cron','--on-exit','--on-exit-cwd','--stream-command','--stream-cwd','--stream-mode','--stream-match','--stream-batch-ms','--stream-max-batch-bytes','--tz','--stagger','--exact','--trigger-script','--trigger-once','--system-event','--message','--script','--script-timeout-seconds','--script-tool-budget','--command','--command-argv','--command-cwd','--command-env','--command-input','--thinking','--model','--fallbacks','--timeout-seconds','--no-output-timeout-seconds','--output-max-bytes','--light-context','--tools','--announce','--deliver','--no-deliver','--webhook','--channel','--to','--thread-id','--account','--best-effort-deliver','--clear-display-name','--enable','--disable','--clear-agent','--clear-session-key','--clear-pacing','--clear-trigger','--clear-thinking','--clear-fallbacks','--clear-model','--no-light-context','--clear-tools','--clear-channel','--clear-to','--clear-thread-id','--clear-account','--no-best-effort-deliver','--failure-alert','--no-failure-alert','--failure-alert-after','--failure-alert-channel','--failure-alert-to','--failure-alert-cooldown','--failure-alert-include-skipped','--failure-alert-exclude-skipped','--failure-alert-mode','--failure-alert-account-id','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'dns') {
                $completions = @('setup')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'dns setup') {
                $completions = @('--domain','--apply')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'docs') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy') {
                $completions = @('blob','coverage','purge','query','run','sessions','start','validate')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy start') {
                $completions = @('--host','--port')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy run') {
                $completions = @('--host','--port')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy validate') {
                $completions = @('--json','--proxy-url','--proxy-ca-file','--allowed-url','--denied-url','--apns-reachable','--apns-authority','--timeout-ms')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy coverage') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy sessions') {
                $completions = @('--json','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy query') {
                $completions = @('--preset','--json','--session')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'proxy blob') {
                $completions = @('--id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks') {
                $completions = @('check','disable','enable','info','install','list','update','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks list') {
                $completions = @('--agent','--eligible','--json','-v','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks info') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks check') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks enable') {
                $completions = @('--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks disable') {
                $completions = @('--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks relay') {
                $completions = @('--provider','--relay-id','--state-db','--generation','--event','--pre-tool-use-unavailable','--timeout')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks install') {
                $completions = @('-l','--link','--pin','--force','--acknowledge-install-policy-warning')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'hooks update') {
                $completions = @('--all','--dry-run','--acknowledge-install-policy-warning')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'webhooks') {
                $completions = @('gmail')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'webhooks gmail') {
                $completions = @('run','setup')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'webhooks gmail setup') {
                $completions = @('--account','--project','--topic','--subscription','--label','--hook-url','--hook-token','--push-token','--bind','--port','--path','--include-body','--max-bytes','--renew-minutes','--tailscale','--tailscale-path','--tailscale-target','--push-endpoint','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'webhooks gmail run') {
                $completions = @('--account','--topic','--subscription','--label','--hook-url','--hook-token','--push-token','--bind','--port','--path','--include-body','--max-bytes','--renew-minutes','--tailscale','--tailscale-path','--tailscale-target')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'qr') {
                $completions = @('--remote','--url','--public-url','--token','--password','--limited','--voice-node','--setup-code-only','--no-ascii','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'clawbot') {
                $completions = @('qr')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'clawbot qr') {
                $completions = @('--remote','--url','--public-url','--token','--password','--limited','--voice-node','--setup-code-only','--no-ascii','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'pairing') {
                $completions = @('approve','list')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'pairing list') {
                $completions = @('--channel','--account','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'pairing approve') {
                $completions = @('--channel','--account','--notify')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins') {
                $completions = @('build','disable','doctor','enable','init','inspect','info','install','list','marketplace','pack','registry','search','uninstall','update','validate')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins list') {
                $completions = @('--json','--enabled','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins search') {
                $completions = @('--limit','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins inspect') {
                $completions = @('--all','--runtime','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins info') {
                $completions = @('--all','--runtime','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins enable') {
                $completions = @('--accept-capabilities')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins uninstall') {
                $completions = @('--keep-files','--keep-config','--force','--dry-run')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins install') {
                $completions = @('-l','--link','--force','--pin','--accept-capabilities','--dangerously-force-unsafe-install','--acknowledge-install-policy-warning','--marketplace')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins update') {
                $completions = @('--all','--dry-run','--accept-capabilities','--dangerously-force-unsafe-install','--acknowledge-install-policy-warning')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins registry') {
                $completions = @('--json','--refresh')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins doctor') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins build') {
                $completions = @('--root','--entry','--check')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins validate') {
                $completions = @('--root','--entry','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins pack') {
                $completions = @('--root','--out','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins init') {
                $completions = @('--directory','--name','--type','--force')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins marketplace') {
                $completions = @('entries','list','refresh')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins marketplace entries') {
                $completions = @('--feed-profile','--feed-url','--offline','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins marketplace refresh') {
                $completions = @('--feed-profile','--feed-url','--expected-sha256','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'plugins marketplace list') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels') {
                $completions = @('add','capabilities','dead-letters','list','login','logout','logs','remove','resolve','status','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels list') {
                $completions = @('--all','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels status') {
                $completions = @('--channel','--probe','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels capabilities') {
                $completions = @('--agent','--channel','--account','--target','--timeout','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels resolve') {
                $completions = @('--channel','--account','--agent','--kind','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels logs') {
                $completions = @('--channel','--lines','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels dead-letters') {
                $completions = @('list','resubmit','--account')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels dead-letters list') {
                $completions = @('--channel','--account','--limit','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels dead-letters resubmit') {
                $completions = @('--channel','--account','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels add') {
                $completions = @('--channel','--agent','--account','--name','--advertised-url','--peer-name','--peer-token','--token','--token-file','--use-env','--audience-type','--audience','--webhook-path','--webhook-url','--private-key','--relay-urls','--relay-url','--bot-token','--http-url','--base-url','--url','--secret','--password','--secret-file','--homeserver','--user-id','--access-token','--device-name','--avatar-url','--initial-sync-limit','--proxy','--dangerously-allow-private-network','--profile','--channel-access-token','--channel-secret','--code','--workspace','--default-to','--allow-from','--agent-activity','--account-sid','--auth-token','--from-number','--messaging-service-sid','--public-webhook-url','--dm-policy','--ship','--group-channels','--dm-allowlist','--auto-discover-channels','--no-auto-discover-channels','--owner-ship','--cli-path','--db-path','--service','--region','--host','--port','--tls','--nick','--username','--realname','--channels','--signal-number','--signal-transport','--http-host','--http-port','--app-token','--user-token','--signing-secret','--identity','--mode','--auth-dir')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels remove') {
                $completions = @('--agent','--channel','--account','--delete')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels login') {
                $completions = @('--agent','--channel','--account','--verbose')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'channels logout') {
                $completions = @('--agent','--channel','--account')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory') {
                $completions = @('groups','peers','self')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory self') {
                $completions = @('--channel','--account','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory peers') {
                $completions = @('list')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory peers list') {
                $completions = @('--channel','--account','--json','--query','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory groups') {
                $completions = @('list','members')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory groups list') {
                $completions = @('--channel','--account','--json','--query','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'directory groups members') {
                $completions = @('--group-id','--channel','--account','--json','--limit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'security') {
                $completions = @('audit')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'security audit') {
                $completions = @('--deep','--auth','--token','--password','--fix','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets') {
                $completions = @('apply','audit','configure','reload','store')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets store') {
                $completions = @('get','import','list','rm','set')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets store list') {
                $completions = @('--scope','--json','--plain')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets store set') {
                $completions = @('--value','--value-file','--kind','--allow-host','--clear-allowed-hosts','--scope','--dry-run')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets store get') {
                $completions = @('--scope','--json','--plain')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets store rm') {
                $completions = @('--scope','--dry-run','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets store import') {
                $completions = @('--from','--kind','--scope','--dry-run','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets reload') {
                $completions = @('--json','--url','--port','--token','--password','--timeout','--expect-final')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets audit') {
                $completions = @('--check','--allow-exec','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets configure') {
                $completions = @('--apply','--yes','--providers-only','--skip-provider-setup','--agent','--allow-exec','--plan-out','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'secrets apply') {
                $completions = @('--from','--dry-run','--allow-exec','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills') {
                $completions = @('check','curator','info','install','library','list','search','update','verify','workshop','--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library') {
                $completions = @('attach','create','detach','disable','enable','import','list','read','refresh','remove','rollback','share','transfer','unshare','update','--url','--port','--token','--password','--timeout','--expect-final','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library list') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--scope','--session')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library read') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--revision','--session')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library create') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--slug')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library update') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision','--slug','--delete-file')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library import') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--slug','--clawhub','--version')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library remove') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library share') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library unshare') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library transfer') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library enable') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library disable') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library rollback') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--expected-revision','--revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library attach') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--session','--skill-id','--revision')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library detach') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--session','--skill-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills library refresh') {
                $completions = @('--url','--port','--token','--password','--timeout','--expect-final','--json','--session','--skill-id')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills search') {
                $completions = @('--limit','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills install') {
                $completions = @('--version','--force','--force-install','--acknowledge-install-policy-warning','--global','--agent','--as')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills update') {
                $completions = @('--all','--force','--force-install','--acknowledge-install-policy-warning','--global','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills verify') {
                $completions = @('--version','--tag','--card','--json','--global','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills curator') {
                $completions = @('pin','restore','status','unpin','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills curator status') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills curator pin') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills curator unpin') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills curator restore') {
                $completions = @('--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop') {
                $completions = @('apply','evaluate','inspect','list','propose-create','propose-update','quarantine','reject','revise','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop list') {
                $completions = @('--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop inspect') {
                $completions = @('--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop propose-create') {
                $completions = @('--name','--description','--proposal','--proposal-dir','--goal','--evidence','--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop propose-update') {
                $completions = @('--proposal','--proposal-dir','--description','--goal','--evidence','--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop revise') {
                $completions = @('--proposal','--proposal-dir','--description','--goal','--evidence','--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop evaluate') {
                $completions = @('--correlation-id','--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop apply') {
                $completions = @('--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop reject') {
                $completions = @('--reason','--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills workshop quarantine') {
                $completions = @('--reason','--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills list') {
                $completions = @('--json','--eligible','-v','--verbose','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills info') {
                $completions = @('--json','--agent')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'skills check') {
                $completions = @('--agent','--json')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'update') {
                $completions = @('cleanup','repair','status','wizard','--json','--no-restart','--dry-run','--channel','--tag','--timeout','--yes','--accept-capabilities')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'update cleanup') {
                $completions = @('--dry-run','--json','--yes')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'update repair') {
                $completions = @('--json','--channel','--timeout','--yes','--accept-capabilities','--no-restart')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'update finalize') {
                $completions = @('--json','--channel','--timeout','--yes','--accept-capabilities','--no-restart')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'update wizard') {
                $completions = @('--accept-capabilities','--timeout')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

            if ($commandPath -eq 'update status') {
                $completions = @('--json','--timeout')
                $completions | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterName', $_)
                }
            }

}
