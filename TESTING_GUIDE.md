# 🧪 Skylar Voice Agent - Testing Guide

## Quick Start Testing

### Prerequisites
1. Navigate to project directory: `/Users/rohithbollineni/Downloads/Website/Voice Agent/form-filler/web/nextjs-ts`
2. Ensure dependencies are installed: `npm install`
3. Start development server: `npm run dev`
4. Open browser to: `http://localhost:3000`

---

## Test Suite 1: Diagnostic Flow (Phase 1)

### Test 1.1: Initial Greeting & Goal Selection
**Steps**:
1. Click "Start Call" button
2. Wait for AI to speak

**Expected Behavior**:
- AI should immediately say: "Hi! I'm Skylar, your strategic advertising co-pilot..."
- AI should present 3 clear options: Launch, Grow, or Event
- Typing indicator should appear when AI is speaking

**Pass Criteria**: ✅ AI proactively asks about goal without waiting for user

---

### Test 1.2: Launch Flow - New Startup
**Steps**:
1. Say: "I want to launch a new product"
2. AI asks about brand stage → Say: "We're a new startup"
3. AI asks about audience → Say: "Young professionals aged 25-35"
4. AI asks about budget → Say: "5 lakh rupees"
5. AI asks about duration → Say: "3 months"

**Expected Behavior**:
- After step 2: "Campaign Foundation" section appears with slide-in animation
- After step 4: "Budget & Timeline" section appears below
- After step 5: Full strategy appears with all 5 channels
- AI explains "The Why" - justifies Digital/Outdoor focus for new startups

**Pass Criteria**: 
- ✅ All 3 UI stages appear progressively
- ✅ AI mentions "new startup" and "digital channels" in justification
- ✅ Allocation shows ~30% Digital, ~30% Outdoor

---

### Test 1.3: Grow Flow - Established Brand
**Steps**:
1. Start new call
2. Say: "I want to grow brand awareness"
3. Say: "We're an established brand"
4. Say: "Targeting families with children"
5. Say: "10 lakh budget"
6. Say: "6 months"

**Expected Behavior**:
- Different allocation than Test 1.2
- AI justifies Aircraft/Outdoor focus for established brands
- Allocation shows ~35% Aircraft, ~30% Outdoor

**Pass Criteria**: 
- ✅ Allocation differs from startup scenario
- ✅ AI mentions "established brand" in justification

---

### Test 1.4: Event Promotion Flow
**Steps**:
1. Start new call
2. Say: "I need to promote an event"
3. Say: "We're a market leader"
4. Say: "General public"
5. Say: "15 lakh"
6. Say: "1 month"

**Expected Behavior**:
- High visibility allocation (Aircraft + Outdoor)
- AI mentions urgency and broad reach
- Allocation shows ~35% Aircraft, ~35% Outdoor

**Pass Criteria**: 
- ✅ High Aircraft + Outdoor allocation
- ✅ AI mentions "event" and "visibility" in justification

---

## Test Suite 2: Progressive UI & Animations (Phase 2)

### Test 2.1: Stage 1 - Campaign Foundation
**Steps**:
1. Start call and complete goal/brand/audience questions
2. Observe UI after answering "target audience"

**Expected Behavior**:
- "Campaign Foundation" section slides in from bottom
- Shows: Goal, Brand Stage, Target Audience
- Header subtitle changes to "Understanding your brand foundation..."
- Animation: smooth slide-in-up

**Pass Criteria**: 
- ✅ Section appears with animation
- ✅ All 3 fields populated correctly
- ✅ Header subtitle updates

---

### Test 2.2: Stage 2 - Budget & Timeline
**Steps**:
1. Continue from Test 2.1
2. Answer budget and duration questions
3. Observe UI after answering "duration"

**Expected Behavior**:
- "Budget & Timeline" section slides in below Stage 1
- Shows: Total Investment (formatted as ₹X,XX,XXX), Campaign Duration
- Header subtitle changes to "Building your customized strategy..."
- Numbers have count-up animation
- Slight delay after Stage 1 (staggered animation)

**Pass Criteria**: 
- ✅ Section appears below Stage 1
- ✅ Numbers animate (count-up effect)
- ✅ Currency formatted correctly

---

### Test 2.3: Stage 3 - Full Strategy
**Steps**:
1. Continue from Test 2.2
2. Wait for AI to build strategy
3. Observe UI when strategy appears

**Expected Behavior**:
- "Media Mix Breakdown" section appears
- All 5 channel cards slide in
- Progress bars animate from 0% to target percentage
- "Impact Dashboard" appears with 4 metrics
- All numbers count up
- "Campaign Timeline" shows monthly breakdown
- Action buttons appear at bottom
- Header subtitle changes to "A Proven Strategy for [Goal]"

**Pass Criteria**: 
- ✅ All sections appear with staggered delays
- ✅ Progress bars animate smoothly (1.5s duration)
- ✅ Numbers count up
- ✅ Timeline shows correct number of months

---

### Test 2.4: Typing Indicator
**Steps**:
1. During any conversation, observe transcript area when AI is speaking

**Expected Behavior**:
- When AI is speaking, typing indicator appears
- Shows "Skylar" with 3 animated dots
- Dots bounce in sequence
- Indicator disappears when AI finishes speaking

**Pass Criteria**: 
- ✅ Indicator appears during AI speech
- ✅ Dots animate smoothly
- ✅ Indicator disappears when done

---

### Test 2.5: Text Reveal Animation
**Steps**:
1. Observe transcript area as conversation progresses

**Expected Behavior**:
- Each new transcript line slides in from left
- Smooth fade-in effect
- No jarring appearance

**Pass Criteria**: 
- ✅ Transcripts animate in smoothly

---

## Test Suite 3: Polish & Micro-interactions (Phase 3)

### Test 3.1: Progress Bar Animations
**Steps**:
1. Complete full diagnostic flow
2. Watch progress bars in "Media Mix Breakdown"

**Expected Behavior**:
- Each bar starts at 0% width
- Animates to target percentage over 1.5 seconds
- Smooth ease-out timing
- All 5 bars animate simultaneously

**Pass Criteria**: 
- ✅ Bars animate from 0% to target
- ✅ Animation is smooth (no jumps)
- ✅ Duration is ~1.5 seconds

---

### Test 3.2: Count-Up Animations
**Steps**:
1. Complete full diagnostic flow
2. Watch numbers in "Impact Dashboard"

**Expected Behavior**:
- Numbers appear with scale + fade effect
- Smooth animation over 0.8 seconds
- Applies to: Total Impressions, Unique Reach, Monthly Investment, Brand Impact Value, Expected ROI

**Pass Criteria**: 
- ✅ Numbers animate in (not instant)
- ✅ Scale effect visible
- ✅ All 5 metrics animate

---

### Test 3.3: Hover States
**Steps**:
1. Complete full diagnostic flow
2. Hover over "Download Report" button
3. Hover over "Schedule Consultation" button

**Expected Behavior**:
- Button scales up slightly (scale 1.02)
- Smooth transition (0.3s)
- Shadow enhances on hover
- Cursor changes to pointer

**Pass Criteria**: 
- ✅ Buttons scale on hover
- ✅ Transition is smooth
- ✅ Both buttons have effect

---

### Test 3.4: Button Press Feedback
**Steps**:
1. Click and hold "Download Report" button
2. Release

**Expected Behavior**:
- On press: button scales down (scale 0.95)
- On release: button returns to normal
- Smooth transition
- Provides tactile feedback

**Pass Criteria**: 
- ✅ Button scales down on press
- ✅ Returns to normal on release
- ✅ Feels responsive

---

### Test 3.5: Staggered Section Animations
**Steps**:
1. Complete full diagnostic flow
2. Watch sections appear in sequence

**Expected Behavior**:
- Stage 1 appears immediately
- Stage 2 appears 0.2s after Stage 1
- Media Mix appears 0.4s after Stage 2
- Impact Dashboard appears 0.6s after Media Mix
- Each section slides in from bottom

**Pass Criteria**: 
- ✅ Sections appear in sequence (not all at once)
- ✅ Delays are noticeable but not too long
- ✅ Creates smooth, professional flow

---

## Test Suite 4: State Management & Cleanup

### Test 4.1: Call End & Reset
**Steps**:
1. Complete full diagnostic flow
2. Say: "Thank you, goodbye"
3. Observe UI

**Expected Behavior**:
- AI says goodbye and ends call
- All campaign sections disappear
- UI returns to initial state
- Call status shows "off"

**Pass Criteria**: 
- ✅ All sections clear
- ✅ No residual data visible
- ✅ Ready for new call

---

### Test 4.2: Multiple Calls in Sequence
**Steps**:
1. Complete Test 4.1
2. Start new call immediately
3. Complete diagnostic flow with different inputs

**Expected Behavior**:
- New call starts fresh (no data from previous call)
- Diagnostic flow begins from start
- UI builds progressively again
- No conflicts or errors

**Pass Criteria**: 
- ✅ No data from previous call
- ✅ Fresh diagnostic flow
- ✅ UI works correctly

---

### Test 4.3: Interrupted Call
**Steps**:
1. Start call
2. Answer only 2 questions (goal and brand stage)
3. End call
4. Start new call

**Expected Behavior**:
- Partial data clears on call end
- New call starts fresh
- No errors or warnings in console

**Pass Criteria**: 
- ✅ Partial data clears
- ✅ New call works normally
- ✅ No console errors

---

## Test Suite 5: Edge Cases & Error Handling

### Test 5.1: Unclear User Input
**Steps**:
1. Start call
2. When asked about goal, say: "I'm not sure"

**Expected Behavior**:
- AI should clarify options
- AI should rephrase question
- AI should guide user to choose Launch/Grow/Event

**Pass Criteria**: 
- ✅ AI handles unclear input gracefully
- ✅ Conversation continues

---

### Test 5.2: Very Large Budget
**Steps**:
1. Start call
2. Say budget is "1 crore rupees"

**Expected Behavior**:
- AI accepts input
- Strategy builds correctly
- Currency formatting handles large numbers
- Allocation percentages remain valid

**Pass Criteria**: 
- ✅ Large numbers formatted correctly
- ✅ No calculation errors
- ✅ UI displays properly

---

### Test 5.3: Very Short Duration
**Steps**:
1. Start call
2. Say duration is "1 week"

**Expected Behavior**:
- AI may suggest minimum duration
- If accepted, timeline shows 1 month (minimum)
- Monthly budget calculated correctly

**Pass Criteria**: 
- ✅ Short duration handled
- ✅ No division errors

---

## Performance Testing

### Test P.1: Animation Performance
**Steps**:
1. Complete full diagnostic flow
2. Observe animation smoothness
3. Check browser DevTools Performance tab

**Expected Behavior**:
- All animations run at 60fps
- No janky or stuttering animations
- CPU usage remains reasonable

**Pass Criteria**: 
- ✅ Smooth 60fps animations
- ✅ No performance warnings

---

### Test P.2: Memory Leaks
**Steps**:
1. Complete 5 full calls in sequence
2. Check browser DevTools Memory tab

**Expected Behavior**:
- Memory usage remains stable
- No continuous growth
- Event listeners cleaned up properly

**Pass Criteria**: 
- ✅ Stable memory usage
- ✅ No leaks detected

---

## Browser Compatibility Testing

### Test B.1: Chrome/Edge
- ✅ All features work
- ✅ Animations smooth
- ✅ Voice input/output works

### Test B.2: Firefox
- ✅ All features work
- ✅ Animations smooth
- ✅ Voice input/output works

### Test B.3: Safari
- ✅ All features work
- ✅ Animations smooth
- ✅ Voice input/output works
- ⚠️ Note: Safari may have different voice API behavior

---

## Accessibility Testing

### Test A.1: Keyboard Navigation
**Steps**:
1. Use Tab key to navigate
2. Use Enter to activate buttons

**Expected Behavior**:
- All interactive elements focusable
- Focus indicators visible
- Logical tab order

**Pass Criteria**: 
- ✅ Full keyboard navigation
- ✅ Visible focus states

---

### Test A.2: Screen Reader
**Steps**:
1. Enable screen reader (VoiceOver/NVDA)
2. Navigate through campaign strategy

**Expected Behavior**:
- All content announced
- Headings properly structured
- ARIA labels present where needed

**Pass Criteria**: 
- ✅ Screen reader compatible
- ✅ Semantic HTML used

---

## Regression Testing Checklist

After any future changes, verify:

- [ ] Diagnostic flow still works
- [ ] All 3 UI stages appear progressively
- [ ] Progress bars animate correctly
- [ ] Numbers count up
- [ ] Typing indicator appears
- [ ] Call end clears all state
- [ ] Multiple calls work in sequence
- [ ] No console errors
- [ ] Animations are smooth
- [ ] Hover states work
- [ ] Button press feedback works

---

## Known Issues & Limitations

1. **Voice Recognition Accuracy**: Depends on user's microphone quality and accent
2. **Budget Parsing**: AI may misinterpret "5 lakh" vs "5 lakhs" - both should work
3. **Duration Parsing**: "3 months" vs "90 days" - AI should normalize to months
4. **Browser Support**: Ultravox SDK may have limited support in older browsers

---

## Reporting Issues

If you find a bug during testing:

1. **Note the exact steps** to reproduce
2. **Check browser console** for errors
3. **Take screenshot** of UI state
4. **Record expected vs actual** behavior
5. **Note browser and OS** version

---

## Success Criteria Summary

✅ **Phase 1**: Diagnostic flow guides user through 5 sequential questions  
✅ **Phase 2**: UI builds progressively in 3 stages with smooth animations  
✅ **Phase 3**: All micro-interactions work (hover, press, animations)  
✅ **Cleanup**: Call end resets all state correctly  
✅ **Performance**: Animations run at 60fps  
✅ **Compatibility**: Works in Chrome, Firefox, Safari  

---

**Testing Date**: 2025-10-28  
**Version**: 1.0.0  
**Status**: ✅ READY FOR TESTING

