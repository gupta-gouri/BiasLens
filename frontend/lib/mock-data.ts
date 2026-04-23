export const mockResult = {
    originalThought:
        "I should choose AI because everyone says web development is dead.",

    biases: [
        { name: "Confirmation Bias", score: 78, color: "primary" },
        { name: "Herd Bias", score: 84, color: "secondary" },
        { name: "Anchoring Bias", score: 52, color: "warning" },
        { name: "Overgeneralization Bias", score: 64, color: "danger" },
    ],

    arguments: {
        facts: [
            "AI is a growing field with rising industry adoption.",
            "Web development is evolving rapidly with new frameworks and AI-assisted tooling.",
        ],
        assumptions: [
            "If many people say web development is declining, it must be true.",
            "Choosing AI automatically guarantees better career outcomes.",
        ],
        conclusion:
            "AI is the only smart option, so web development should be avoided.",
    },

    firewall: {
        devil: [
            "What evidence proves web development is actually dead?",
            "Could online opinions be exaggerating the trend?",
            "Are you choosing AI from interest or from pressure?",
        ],
        statistician: [
            "Demand still exists for web developers across startups and enterprises.",
            "AI roles are growing, but competition and specialization are also increasing.",
            "A blended skillset may be more practical than an either-or choice.",
        ],
        judge: [
            "Your current reasoning is influenced by social consensus.",
            "The conclusion is too absolute for the evidence available.",
            "A balanced decision should compare interests, opportunities, and long-term fit.",
        ],
    },

    improvedThought:
        "AI is an exciting and growing field, but that does not mean web development is dead. I should compare both paths based on my interests, strengths, market demand, and long-term goals before deciding.",

    improvement: [
        { name: "Confirmation Bias", before: 78, after: 34 },
        { name: "Herd Bias", before: 84, after: 28 },
        { name: "Anchoring Bias", before: 52, after: 26 },
        { name: "Overgeneralization Bias", before: 64, after: 22 },
    ],
};

export const dashboardMock = {
    stats: [
        { label: "Analyses", value: "124" },
        { label: "Avg. Bias Score", value: "61%" },
        { label: "Most Common Bias", value: "Herd Bias" },
        { label: "Improvement Rate", value: "48%" },
    ],
    trend: [
        { month: "Jan", confirmation: 68, herd: 74, anchoring: 50, overgeneralization: 61 },
        { month: "Feb", confirmation: 64, herd: 71, anchoring: 48, overgeneralization: 58 },
        { month: "Mar", confirmation: 59, herd: 66, anchoring: 44, overgeneralization: 53 },
        { month: "Apr", confirmation: 54, herd: 60, anchoring: 39, overgeneralization: 47 },
        { month: "May", confirmation: 50, herd: 57, anchoring: 35, overgeneralization: 43 },
    ],
    commonBiases: [
        { name: "Herd Bias", value: 32 },
        { name: "Confirmation Bias", value: 27 },
        { name: "Overgeneralization Bias", value: 22 },
        { name: "Anchoring Bias", value: 19 },
    ],
    recent: [
        "I should learn AI because everyone says it has the best future.",
        "If I fail once, maybe I am not meant for coding.",
        "This internship is at a big company, so it must be the best option.",
    ],
    insights: [
        "Social influence is affecting many of your decisions.",
        "Absolute conclusions appear often when evidence is limited.",
        "Your rewritten thoughts show stronger balance over time.",
    ],
};