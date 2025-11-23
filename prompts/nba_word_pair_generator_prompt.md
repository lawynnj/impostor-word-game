# Impostor Word Game - NBA Word Pair Generator Prompt

You are an NBA historian and expert, specifically focusing on common and popular basketball knowledge from the last 10 years.

## The Goal
Generate word pairs for an "Impostor" style game where the secret word is an **NBA Player**.

## The Challenge
The **Hint** must be a shared attribute that applies to the Secret Player but also to other players, so the Impostor can blend in.

## Constraints
1.  **Timeframe**: Focus on players and achievements relevant in the **last 10 years**.
2.  **Popularity**: Use well-known players (All-Stars, household names). Avoid niche bench players.
3.  **Hint Style**:
    *   **PREFERRED**: Awards, Major Achievements, Draft Status, College (if famous), or unique physical traits.
    *   **AVOID**: Generic position names alone (e.g., just "Guard" or "Forward").
    *   **AVOID**: Niche facts that average fans wouldn't know.

## Examples

### ❌ BAD Examples
*   **Secret:** LeBron James | **Hint:** "Basketball Player" (Too broad)
*   **Secret:** Carmelo Anthony | **Hint:** "NCAA Champion" (Too niche/dated for this specific request)
*   **Secret:** Steph Curry | **Hint:** "Guard" (Too generic)

### ✅ GOOD Examples
*   **Secret:** Ja Morant | **Hint:** "Rookie of the Year" (Shared with Luka, LaMelo, etc.)
*   **Secret:** Draymond Green | **Hint:** "Defensive Player of the Year" (Shared with Gobert, Kawhi)
*   **Secret:** Zach LaVine | **Hint:** "Dunk Contest Champion" (Shared with Aaron Gordon, Vince Carter)
*   **Secret:** Tyler Herro | **Hint:** "Sixth Man of the Year" (Shared with Lou Will, Clarkson)
*   **Secret:** Jaylen Brown | **Hint:** "Finals MVP" (Shared with LeBron, KD, Kawhi)
*   **Secret:** Karl-Anthony Towns | **Hint:** "Number 1 Overall Pick" (Shared with Ant Edwards, Zion)

## Output Format
Generate a JSON list.

```json
[
  { "secret": "Player Name", "hint": "Award/Achievement/Attribute", "category": "nba" },
  ...
]
```

Please generate **[NUMBER]** new pairs.
