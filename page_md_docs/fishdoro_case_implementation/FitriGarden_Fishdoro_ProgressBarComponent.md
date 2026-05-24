# Fishdoro — Progress Bar Component
*Reading progress indicator for the case study*
*Sticky bar at top of .cs-content that fills as user scrolls*

---

## Copilot Prompt

```
Add a reading progress bar to the Fishdoro case study content area.

The bar is a thin 2px line at the very top of .cs-content (the scroll
container). It fills from left to right as the user scrolls through
the case study.

IMPORTANT: The progress must track .cs-content scroll, NOT window scroll.
The case study is an expand view — only .cs-content scrolls, not the page.

POSITION:
  Inside .cs-content, as the very first child element
  position: sticky, top: 0, z-index 5
  This makes it stick to the top of the scroll container as user scrolls

STYLE:
  Outer bar (.cs-progress-bar):
    width 100%, height 2px
    background rgba(154,175,122,0.15)
    margin-bottom 28px

  Fill (.cs-progress-fill):
    height 100%
    background #6b8f4e
    width 0% (updated by JS)
    transition width 0.1s linear

JS:
  Attach scroll listener to .cs-content (not window)
  On scroll: calculate scrollTop / (scrollHeight - clientHeight) * 100
  Set .cs-progress-fill width to that percentage
  Clamp between 0 and 100
```

---

## Full HTML + CSS + JS Code

Add to your case study page layout — inside `.cs-content`, as first child:

```html
<!-- Progress bar — add as FIRST CHILD inside .cs-content -->
<div class="cs-progress-bar" id="csProgressBar">
  <div class="cs-progress-fill" id="csProgressFill"></div>
</div>
```

Add to your case study CSS:

```css
.cs-progress-bar {
  position: sticky;
  top: 0;
  width: 100%;
  height: 2px;
  background: rgba(154, 175, 122, 0.15);
  z-index: 5;
  margin-bottom: 28px;
  flex-shrink: 0;
}

.cs-progress-fill {
  height: 100%;
  background: #6b8f4e;
  width: 0%;
  transition: width 0.1s linear;
}
```

Add to your case study script:

```js
// Progress bar — tracks .cs-content scroll, NOT window
const csContent = document.querySelector('.cs-content')
const progressFill = document.getElementById('csProgressFill')

if (csContent && progressFill) {
  csContent.addEventListener('scroll', () => {
    const scrollTop = csContent.scrollTop
    const scrollHeight = csContent.scrollHeight - csContent.clientHeight
    const pct = scrollHeight > 0
      ? Math.min((scrollTop / scrollHeight) * 100, 100)
      : 0
    progressFill.style.width = pct + '%'
  })
}
```

---

## How to use

The progress bar is not a standalone component — it's added directly
to the case study layout file.

In your case study page (wherever `.cs-content` is defined):

```html
<div class="cs-content">

  <!-- Progress bar — must be FIRST child -->
  <div class="cs-progress-bar" id="csProgressBar">
    <div class="cs-progress-fill" id="csProgressFill"></div>
  </div>

  <!-- Rest of case study content -->
  <div class="cs-inner">
    ...
  </div>

</div>
```

---

## Critical note

If the bar doesn't move when scrolling, it means the scroll event
is attached to the wrong element. Verify that `.cs-content` is the
element that actually has `overflow-y: auto` or `overflow-y: scroll`.

Quick debug check:
```js
console.log(document.querySelector('.cs-content').scrollHeight)
// Should be larger than clientHeight if content overflows
```
