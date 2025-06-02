# Contributing to CompanionKit

Thank you for your interest in helping us preserve memories and support families affected by dementia. Every contribution makes a difference in someone's life.

## 🎯 Our Mission

StayReel is more than code - it's about human connection. We're building technology that:
- Helps people with dementia share their stories
- Supports unpaid caregivers in their journey
- Creates lasting family legacies

## 🌟 Priority Areas

### 1. Accessibility & Usability
- **Senior-friendly UI**: Large buttons, clear text, simple navigation
- **Voice-first design**: Minimize typing requirements
- **Cognitive load reduction**: Simplified workflows
- **Multi-language support**: Reaching diverse communities

### 2. Caregiver Support Tools
- **Session summaries**: Auto-generated care notes
- **Mood tracking**: Understanding emotional patterns
- **Memory prompts**: Conversation starters that work
- **Care insights**: Actionable information for better care

### 3. Memory Preservation Features
- **Story templates**: Guided memory collection
- **Photo integration**: Turning images into narratives
- **Timeline views**: Organizing life stories
- **Export formats**: Shareable memory books

### 4. Clinical & Research
- **HIPAA compliance**: Protecting sensitive data
- **Clinical metrics**: Measuring engagement
- **Research tools**: Supporting dementia studies
- **Care facility integration**: Institutional workflows

## 🚀 Getting Started

### Join Our Community

1. **Slack Workspace**: [StayReel Developers](https://join.slack.com/t/stayreel-community/shared_invite/xyz)
   - `#general` - Community discussions
   - `#dev-help` - Technical questions
   - `#caregivers` - Feature feedback
   - `#research` - Clinical collaboration

2. **Weekly Calls**: Thursdays at 2 PM PT
   - Demo new features
   - Discuss roadmap
   - Share caregiver stories

### Development Setup

```bash
# Clone repository
git clone git@github.com:Tricia-42/StayReel.git
cd StayReel

# Run setup script
./scripts/setup.sh

# Start development
npm run dev
```

## 🔧 Contribution Guidelines

### Before You Start

1. **Understand the users**: Read caregiver stories in our Slack
2. **Check existing work**: Browse open issues and PRs
3. **Discuss big changes**: Share ideas in Slack first
4. **Consider accessibility**: Every feature should work for seniors

### Code Standards

#### Accessibility First
```typescript
// ❌ Don't
<button onClick={handleClick}>Save</button>

// ✅ Do
<button 
  onClick={handleClick}
  aria-label="Save memory"
  className="text-xl p-4 bg-blue-600 hover:bg-blue-700"
>
  <SaveIcon className="w-6 h-6 mr-2" />
  Save Memory
</button>
```

#### Clear Error Messages
```typescript
// ❌ Don't
throw new Error("Failed to save")

// ✅ Do
throw new Error("Unable to save your memory. Please check your internet connection and try again.")
```

#### Privacy by Design
```typescript
// Always encrypt sensitive data
const encryptedMemory = await encrypt(memoryData, familyKey)
// Never log personal information
logger.info("Memory saved", { id: memory.id }) // No content
```

### Commit Messages

Use clear, empathetic language:

```
✅ Good examples:
feat: add larger buttons for easier touch interaction
fix: improve voice recognition for accented speech
docs: add caregiver quick-start guide
a11y: increase color contrast for vision impairment

❌ Avoid:
feat: big buttons
fix: voice stuff
update docs
```

### Testing with Empathy

1. **User scenarios**: Test with real caregiver workflows
2. **Accessibility**: Use screen readers and keyboard navigation
3. **Performance**: Test on older devices
4. **Offline support**: Many users have limited connectivity

## 📝 Pull Request Process

### PR Template

```markdown
## What does this PR do?
Brief description of changes and who benefits

## User Story
As a [caregiver/person with dementia/family member]
I want to [action]
So that [benefit]

## Testing
- [ ] Tested with keyboard navigation
- [ ] Verified on mobile devices
- [ ] Checked with screen reader
- [ ] Tested offline functionality

## Screenshots
(Include before/after for UI changes)

## Caregiver Impact
How does this help our users?
```

### Review Process

1. **Code review**: Technical correctness
2. **UX review**: Usability for target users
3. **Caregiver review**: Real-world applicability
4. **Clinical review**: (if applicable) Safety and ethics

## 🏥 Clinical & Research Contributions

If you're a healthcare professional or researcher:

1. Join `#research` channel in Slack
2. Review our IRB guidelines
3. Propose studies via research@heytricia.ai
4. Help validate clinical features

## 🎖️ Recognition

We celebrate contributors who:
- Make StayReel more accessible
- Share caregiver perspectives
- Improve quality of life metrics
- Bridge technology and care

Contributors are:
- Featured in release notes
- Invited to caregiver feedback sessions
- Given "Care Champion" recognition
- Credited in research publications

## 💙 Code of Care

Beyond our code of conduct, we follow a "Code of Care":

1. **Dignity First**: Every feature respects user dignity
2. **Inclusive Design**: Build for the most vulnerable
3. **Privacy Sacred**: User data is a sacred trust
4. **Caregiver Voice**: Listen to those who care
5. **Joy Matters**: Technology should spark joy, not frustration

## 📞 Get Help

- **Technical**: Post in `#dev-help` on Slack
- **Product**: Discuss in `#product-ideas`
- **Urgent**: Email support@heytricia.ai
- **Research**: Contact research@heytricia.ai

---

<p align="center">
  <strong>Together, we're preserving what matters most</strong><br>
  Thank you for contributing to StayReel 💙
</p> 