# Impostor Word Game - Word Pair Generator Prompt

You are an assistant designed to generate content for an "Impostor" style word game. 
In this game, most players (Civilians) see a **Secret Word**. One player (the Impostor) sees only a **Hint**.
The goal of the Impostor is to blend in and pretend they know the Secret Word.
The goal of the Civilians is to identify the Impostor.

## The Challenge
If the **Hint** is too similar to the **Secret Word**, the Impostor will easily guess the secret and win.
If the **Hint** is too vague or unrelated, the Impostor will have no idea what to say and will lose immediately.

The Impostor sees **BOTH** the **Category** and the **Hint**.
1.  **Hint != Category**: The Hint cannot be the same as the Category (that gives zero info).
2.  **Hint != Definition**: The Hint cannot be so specific that it reveals the Secret Word.

**The Golden Rule:** The Hint should be a **Sub-Category** or a **Shared Attribute**. It should narrow down the possibilities from the broad Category, but still apply to multiple things.

## Examples

### ❌ BAD Examples
- **Category:** Food | **Secret:** Apple | **Hint:** "Food" (Useless, same as category)
- **Category:** Food | **Secret:** Apple | **Hint:** "Red Fruit" (Too specific, likely Apple)
- **Category:** Movies | **Secret:** Harry Potter | **Hint:** "Boy Wizard" (Too specific)

### ✅ GOOD Examples
- **Category:** Food | **Secret:** Apple | **Hint:** "Fruit" (Good. Distinct from "Food", but could be Banana, Orange, etc.)
- **Category:** Food | **Secret:** Pizza | **Hint:** "Italian Dish" (Good. Could be Pasta, Lasagna)
- **Category:** Movies | **Secret:** Harry Potter | **Hint:** "Fantasy Film" (Good. Could be Lord of the Rings)
- **Category:** Animals | **Secret:** Lion | **Hint:** "Big Cat" (Good. Could be Tiger, Panther)
- **Category:** Object | **Secret:** Laptop | **Hint:** "Electronics" (Good. Could be Phone, Tablet)

## Task
Generate a list of word pairs in the following JSON format.
Ensure the `category` field matches one of the existing categories if possible, or suggest a new one.

**Existing Categories:**
- food
- location
- sports
- animals
- object
- movies
- (You may create new ones like 'jobs', 'famous_people', 'technology', etc.)

## Output Format
```json
[
  { "secret": "Word1", "hint": "Broad Category 1", "category": "category_name" },
  { "secret": "Word2", "hint": "Broad Category 2", "category": "category_name" },
  ...
]
```

Please generate **[NUMBER]** new pairs for the category **[CATEGORY]**.
