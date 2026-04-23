def run_devils_advocate_agent(agent_input):
    argument_data = agent_input.get("argument_extraction", {})
    bias_analysis = agent_input.get("bias_analysis", {})

    decision_claim = argument_data.get("decision_claim", "")
    supporting_reasons = argument_data.get("supporting_reasons", [])
    assumptions = argument_data.get("assumptions", [])
    facts = argument_data.get("facts", [])
    bias_scores = bias_analysis.get("bias_scores", {})

    findings = []
    counterarguments = []

    if assumptions:
        findings.append("The decision depends on assumptions that are not yet verified.")

    if len(supporting_reasons) <= 1:
        findings.append("The reasoning relies on limited supporting reasons.")

    if not facts:
        findings.append("No concrete facts are presented to support the claim.")

    if bias_scores.get("confirmation_bias", 0) > 0.4:
        findings.append("The reasoning may be selectively supporting a preferred conclusion.")

    if bias_scores.get("anchoring_bias", 0) > 0.4:
        findings.append("The decision may be stuck to an initial belief or framing.")

    for assumption in assumptions:
        counterarguments.append(f"What evidence proves this assumption: '{assumption}'?")

    if not counterarguments and decision_claim:
        counterarguments.append(
            f"What would be the strongest argument against this decision: '{decision_claim}'?"
        )

    return {
        "agent_name": "Devils Advocate",
        "role": "Challenges hidden assumptions and stress-tests the reasoning.",
        "findings": findings,
        "counterarguments": counterarguments,
        "verdict": "Reasoning needs stronger challenge" if findings else "No major logical weaknesses detected"
    }


def run_statistician_agent(agent_input):
    argument_data = agent_input.get("argument_extraction", {})
    bias_analysis = agent_input.get("bias_analysis", {})

    facts = argument_data.get("facts", [])
    assumptions = argument_data.get("assumptions", [])
    supporting_reasons = argument_data.get("supporting_reasons", [])
    bias_scores = bias_analysis.get("bias_scores", {})

    findings = []

    if not facts:
        findings.append("No explicit factual evidence was provided.")

    if assumptions:
        findings.append("Some parts of the reasoning are assumption-driven rather than evidence-driven.")

    if len(supporting_reasons) < 1:
        findings.append("There is not enough supporting justification.")

    if bias_scores.get("availability_bias", 0) > 0.4:
        findings.append("The reasoning may rely on exaggerated, memorable, or emotionally strong claims.")

    if bias_scores.get("social_influence_bias", 0) > 0.4:
        findings.append("The reasoning may be influenced by what others say instead of objective support.")

    if len(findings) >= 3:
        evidence_strength = "low"
    elif len(findings) == 2:
        evidence_strength = "medium"
    else:
        evidence_strength = "high"

    return {
        "agent_name": "Statistician",
        "role": "Checks whether the decision has enough supporting evidence.",
        "findings": findings,
        "evidence_strength": evidence_strength,
        "verdict": "Evidence support is weak" if findings else "Evidence support appears acceptable"
    }


def run_neutral_judge_agent(agent_input, devils_advocate_output, statistician_output):
    argument_data = agent_input.get("argument_extraction", {})
    decision_claim = argument_data.get("decision_claim", "")
    conclusion = argument_data.get("conclusion", "")

    key_issues = []
    key_issues.extend(devils_advocate_output.get("findings", []))
    key_issues.extend(statistician_output.get("findings", []))

    seen = set()
    deduped_issues = []
    for issue in key_issues:
        if issue not in seen:
            seen.add(issue)
            deduped_issues.append(issue)

    if deduped_issues:
        final_verdict = "The decision is not yet fully justified."
        recommendation = "Validate assumptions, gather evidence, and reconsider the reasoning before finalizing the decision."
    else:
        final_verdict = "The decision appears reasonably justified."
        recommendation = "Proceed carefully and continue validating with evidence."

    return {
        "agent_name": "Neutral Judge",
        "role": "Synthesizes all analyses and evaluates the final conclusion.",
        "decision_claim": decision_claim,
        "conclusion_reviewed": conclusion,
        "key_issues": deduped_issues,
        "final_verdict": final_verdict,
        "recommendation": recommendation
    }


def run_cognitive_firewall(agent_input):
    devils_advocate_output = run_devils_advocate_agent(agent_input)
    statistician_output = run_statistician_agent(agent_input)
    neutral_judge_output = run_neutral_judge_agent(
        agent_input,
        devils_advocate_output,
        statistician_output
    )

    return {
        "devils_advocate": devils_advocate_output,
        "statistician": statistician_output,
        "neutral_judge": neutral_judge_output
    }