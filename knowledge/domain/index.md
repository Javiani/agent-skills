
# Domain

A Domain represents one screen or page. It includes every part required for that screen to work correctly and independently.

Each screen must be `standalone`. It must know all inputs and outputs required to operate and to expose data needed by the next screen.

The Domain is the highest-level component of the screen. It contains the components and dependencies required to generate the screen and must be imported and rendered according to the framework route.

The Domain is a composition and coordination boundary, not the place for detailed markup of every screen block. Keep the Domain responsible for screen-level orchestration, loading screen data, and stacking Section Components vertically. Components that depend on shared screen state should read it through the store adapter available for the selected UI framework instead of receiving that state through the Domain. Put the HTML and visual details of each meaningful screen block in `components/<section-name>/index`.

The Domain `index` file must export one public root component for the screen. Do not define additional named or private UI components in that file. Each secondary screen block, including a detail panel, dialog, drawer, or overlay, must be a Section Component in its own `components/<component-name>/index` module and be imported by the Domain root.

For example, a screen Domain may compose `PageHeader`, `ScreenIntro`, and `ResultsSection`. `ScreenIntro` and `ResultsSection` read the store state they need through the framework adapter; the Domain should not pass the same store state through props or contain the intro heading, description, and input or action control inline.

```tsx
export default function ExampleScreen() {
	return (
		<DefaultLayout>
			<PageHeader />
			<ScreenIntro />
			<ResultsSection />
		</DefaultLayout>
	)
}
```

If a block has a clear visual context and can be named as a screen section, create the section component before adding more markup to the Domain. Keep only small conditional wrappers and composition logic in the Domain.

Code example using Astro:

```
---
import Header from '<path of the component>'
import Hero from '<path of the component>'
import Features from '<path of the component>'
import Examples from '<path of the component>'
import Cta from '<path of the component>'
import Footer from '<path of the component>'
--- 

<main>
	<Header />
	<Hero />
	<Features />
	<Examples />
	<Cta />
	<Footer />
</main>

```
