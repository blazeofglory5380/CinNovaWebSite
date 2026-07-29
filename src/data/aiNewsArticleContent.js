export const aiNewsArticleContent = {
    "updatedLabel": "Updated July 13, 2026",
    "currentThrough": "Current through July 13, 2026. Because this is a developing technology story, production schedules and spending targets may change.",
    "dek": "Meta's reported plan to manufacture a custom AI accelerator in September is more than a chip story. It is a sign that the next phase of AI competition will be decided by who controls the hardware, energy, supply chain, and rules governing increasingly autonomous systems.",
    "visualType": "meta-iris-news",
    "metrics": [
        {
            "value": "September",
            "label": "reported target for Meta to begin manufacturing its custom Iris AI chip"
        },
        {
            "value": "14 GW",
            "label": "reported total computing-capacity target for Meta in 2027"
        },
        {
            "value": "$145B",
            "label": "upper end of Meta's expected 2026 AI-infrastructure spending"
        },
        {
            "value": "6 months",
            "label": "planned cadence for new generations of Meta custom AI chips through 2027"
        }
    ],
    "timeline": [
        {
            "date": "March 2026",
            "title": "Meta outlines a four-chip roadmap",
            "text": "Meta publicly presents a new generation of in-house AI processors under its MTIA program, signaling that custom silicon will become a larger part of its infrastructure strategy."
        },
        {
            "date": "July 9",
            "title": "Iris production target is reported",
            "text": "Reuters reports that an internal memo calls for Iris manufacturing to begin in September after a six-week testing process found no major issues."
        },
        {
            "date": "July 9",
            "title": "The ITU launches an AI-agent focus group",
            "text": "At the AI for Good Summit, the UN digital-technology agency announces work on frameworks for agent identity, trust, accountability, and meaningful human control."
        },
        {
            "date": "September 2026",
            "title": "Targeted start of chip manufacturing",
            "text": "If the schedule holds, Meta begins producing Iris with design support from Broadcom and manufacturing by TSMC."
        },
        {
            "date": "2027",
            "title": "The scale test",
            "text": "Meta aims to reach 14 gigawatts of total computing capacity while releasing new custom-chip generations at a much faster cadence than the traditional annual cycle."
        }
    ],
    "sections": [
        {
            "heading": "The latest: Meta is trying to turn custom silicon into a strategic advantage",
            "paragraphs": [
                "The most important AI story this week is not a new chatbot feature. It is Meta's reported plan to begin manufacturing a custom data-center chip, code-named Iris, in September 2026. According to an internal memo reviewed by Reuters, Iris is part of a four-generation Meta Training and Inference Accelerator program designed around the company's own workloads. Broadcom is helping with the design, while Taiwan Semiconductor Manufacturing Company is expected to manufacture the chip.",
                "Iris is not described as a complete replacement for Nvidia or AMD graphics processors. Meta still needs enormous quantities of general-purpose GPUs for training and running advanced models. The custom chip is meant to supplement those systems, handle selected workloads more efficiently, and reduce the time and cost involved in adapting outside hardware to Meta's unusually large infrastructure. That distinction matters: the strategy is diversification first, independence later.",
                "The reported development pace is unusually aggressive. Testing took about six weeks and found no major problems, and Meta reportedly wants to introduce a new custom chip roughly every six months through 2027. Traditional enterprise chip cycles often move more slowly because hardware mistakes are expensive and difficult to correct after manufacturing begins. A faster cadence suggests Meta is treating silicon more like software: specialized, iterative, and closely tied to the models and products it operates.",
                "For users, this may sound remote from everyday AI. It is not. The cost of inference—the process of generating an answer, image, recommendation, or action—affects how many AI features a company can offer, how quickly they respond, and whether they can be included free or must be placed behind subscriptions and usage limits. Better-matched hardware can lower the cost of every interaction across Facebook, Instagram, WhatsApp, advertising systems, and future agent products."
            ]
        },
        {
            "heading": "The bigger number is 14 gigawatts—and it changes what an AI company is",
            "paragraphs": [
                "The Iris chip is only one part of a much larger expansion. Reuters reported that Meta plans to deploy seven gigawatts of computing infrastructure in 2026 and double total capacity to 14 gigawatts in 2027. The company also expects to spend as much as $145 billion on AI infrastructure this year. These figures describe a business that is no longer merely buying servers. It is coordinating data centers, electricity, memory, storage, networking equipment, fiber, cooling, construction, and long-term manufacturing agreements at the scale of a national industrial project.",
                "That scale creates a new competitive moat. A strong model can be copied, fine-tuned, or surpassed. A secured supply chain, specialized chips, contracted power, trained operations teams, and a global data-center network are much harder to reproduce. This is why the AI race is moving down the technology stack. Google has long designed TPUs, Amazon has Trainium and Inferentia, Microsoft has its own accelerators, and other labs are exploring custom silicon. The strategic question is becoming: can a company control enough of its stack to keep improving even when outside components are scarce or expensive?",
                "The risk is that infrastructure ambition can outrun proven demand. Fourteen gigawatts represents enormous capital and energy commitments. If AI revenue grows more slowly than expected, custom chips underperform, or data-center construction is delayed by power and permitting constraints, the fixed costs remain. The same hardware that can make AI cheaper at scale can become a financial burden if the workloads do not arrive.",
                "There is also a public-policy consequence. Communities that host AI data centers may face pressure on electricity grids, water systems, land, and construction capacity. The benefits—jobs, tax revenue, and technical investment—are real, but they are often distributed differently from the costs. Infrastructure announcements therefore need more than a spending headline. They need transparent plans for power procurement, grid upgrades, water use, emissions, local hiring, and who pays when new capacity is required."
            ]
        },
        {
            "heading": "At the same moment, global standards bodies are asking who an AI agent really is",
            "paragraphs": [
                "A second development this week points to the other half of the AI race: trust. At the AI for Good Summit in Geneva, the International Telecommunication Union announced a focus group dedicated to increasingly autonomous AI agents. These systems do more than answer questions. They can schedule appointments, purchase products, move information between services, execute parts of business workflows, and eventually negotiate or transact on behalf of a person or organization.",
                "The ITU says the new group will develop frameworks to keep agents identifiable, trustworthy, and under meaningful human control, especially in finance and critical infrastructure. Its first meeting is expected in Paris in November, followed by a meeting in Geneva in January. The group will bring together technical, legal, and policy specialists because agent trust cannot be solved by model accuracy alone.",
                "Consider a travel agent that books a flight. A useful system needs access to a user's identity, calendar, preferences, and payment method. But every additional permission creates a question. Can the airline verify that the agent is authorized? Can the user limit the maximum price? Who is responsible if the agent books the wrong date? Can another AI impersonate it? Is there a clear log showing which action was proposed, approved, and completed? Without shared answers, autonomous agents may remain impressive demos rather than dependable infrastructure.",
                "This is where the chip story and the standards story connect. More compute makes agents faster, cheaper, and available to billions of users. Standards determine whether those agents can safely cross organizational boundaries. The companies that win may not be those with only the smartest models. They may be the ones that combine efficient infrastructure with identity, permissions, audit trails, human-approval controls, and interoperability that other institutions can trust."
            ]
        },
        {
            "heading": "What businesses and builders should watch next",
            "paragraphs": [
                "First, watch whether Iris reaches production on schedule and which workloads Meta assigns to it. A custom chip's value is measured less by benchmark headlines than by sustained performance, power efficiency, reliability, and the percentage of real traffic it can handle. If Meta can move large recommendation, advertising, or model-inference workloads onto its own accelerators, the cost savings could be significant even while it continues purchasing outside GPUs.",
                "Second, watch the supply agreements around the chip. AI systems depend on far more than the processor. High-bandwidth memory, flash storage, networking, packaging capacity, fiber-optic equipment, and electricity can each become a bottleneck. Reuters reported multi-year Meta agreements involving Samsung, Sandisk, and Sumitomo Electric. Those contracts show that AI competition is being fought through procurement as much as research.",
                "Third, watch whether AI-agent standards become implementable technical requirements rather than broad principles. Useful standards could include cryptographic agent identity, scoped permissions, transaction limits, revocation, tamper-evident logs, disclosure when a user is interacting with an agent, and reliable escalation to a human. A framework that cannot be tested will not create trust.",
                "Finally, builders should avoid designing products that assume unlimited compute or unlimited authority. Efficient models, fallback modes, clear consent screens, narrow permissions, and reversible actions are strategic features. They lower cost, reduce risk, and make an AI product easier to deploy in schools, healthcare, finance, government, and other environments where trust matters as much as capability."
            ]
        }
    ],
    "pros": [
        {
            "title": "Lower cost for high-volume AI",
            "text": "Hardware tuned to Meta's own workloads could reduce power use and cost per inference, making large-scale AI features more economical.",
            "example": "Example: A recommendation or assistant feature used billions of times per day becomes viable at a lower per-request cost without requiring every task to run on the most expensive GPU available."
        },
        {
            "title": "Less dependence on a single supplier",
            "text": "Custom chips give Meta another option when leading GPUs are scarce, delayed, or expensive, strengthening its negotiating position and operational resilience.",
            "example": "Example: If a new external GPU generation is supply-constrained, Meta can shift selected internal workloads to Iris rather than postponing every product rollout."
        },
        {
            "title": "A path toward safer agent deployment",
            "text": "International work on identity and human control can create common expectations before autonomous agents become embedded in sensitive transactions.",
            "example": "Example: A banking agent could carry a verifiable identity, a $500 transaction ceiling, and a rule requiring human approval for a new recipient."
        }
    ],
    "cons": [
        {
            "title": "Infrastructure concentration",
            "text": "The cost of chips, energy, and data centers may give the largest technology companies advantages that smaller labs, universities, and countries cannot match.",
            "example": "Example: A startup with a better model idea may still struggle to compete because it cannot reserve enough accelerators or afford inference at global scale."
        },
        {
            "title": "Energy and community pressure",
            "text": "Rapid compute expansion can strain grids, water supplies, construction markets, and public budgets if local infrastructure is not upgraded transparently.",
            "example": "Example: A utility builds new generation and transmission for a data center, but residential customers face higher rates unless the project fully covers its incremental costs."
        },
        {
            "title": "Standards could lag behind deployment",
            "text": "AI-agent frameworks may take months or years to mature while products with broad permissions are already reaching users.",
            "example": "Example: An agent can purchase services today, but merchants still lack a universal way to verify its authority or assign responsibility when it makes an error."
        }
    ],
    "conclusion": "Meta's Iris plan is a clear signal that frontier AI is becoming an infrastructure industry. Model quality still matters, but the decisive advantages are shifting toward custom silicon, contracted energy, supply-chain control, and the ability to operate AI at enormous scale. The ITU's agent initiative shows the matching challenge: capability must be paired with identity, permissions, accountability, and meaningful human control. The next era of AI will not be won by intelligence alone. It will be won by systems that can deliver that intelligence efficiently—and earn permission to act.",
    "sources": [
        {
            "outlet": "Reuters",
            "title": "Meta to put AI chip into production in September as it looks to double computing capacity",
            "url": "https://www.reuters.com/world/asia-pacific/meta-put-ai-chip-into-production-september-it-looks-double-computing-capacity-2026-07-09/"
        },
        {
            "outlet": "Reuters",
            "title": "UN digital tech agency launches initiative to improve trust in AI agents",
            "url": "https://www.reuters.com/legal/litigation/un-digital-tech-agency-launches-initiative-improve-trust-ai-agents-2026-07-09/"
        },
        {
            "outlet": "WIRED",
            "title": "Robot Dogs, Teslas, and Rescue Helicopters: The UN AI Summit Was a Lot",
            "url": "https://www.wired.com/story/robot-dogs-teslas-and-rescue-helicopters-the-un-ai-summit-was-alot/"
        },
        {
            "outlet": "Axios",
            "title": "UN launches AI for Good commission with AI CEOs and world leaders",
            "url": "https://www.axios.com/2026/07/01/un-ai-commission-ceos-world-leaders"
        }
    ]
};
