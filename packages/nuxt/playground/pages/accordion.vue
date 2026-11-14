<template>
    <ShowcaseContainer>
        <!-- Basic Accordion -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Basic Accordion
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                A simple accordion with multiple items that can be expanded and collapsed.
            </p>
            
            <WfAccordionRoot :items="basicItems" :css="{
                    icon: css.raw({ color: 'primary' })
                }"/>
        </div>

        <!-- Accordion with Rich Content -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Accordion with Rich Content
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Accordion items can contain HTML content for more complex layouts.
            </p>
            
            <WfAccordionRoot 
                orientation="horizontal"
                :items="richContentItems"
                 />
        </div>

        <!-- FAQ Style Accordion -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                FAQ Style Accordion
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                A typical FAQ implementation using the accordion component.
            </p>
            
            <WfAccordionRoot type="single" :items="faqItems" />
        </div>

        <!-- Multiple Items Accordion -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Multiple Items
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Accordion with several items demonstrating scalability.
            </p>
            
            <WfAccordionRoot :items="multipleItems" />
        </div>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css'

// Basic accordion items
const basicItems = [
    {
        icon: 'arrow-left',
        id: 'item-1',
        title: 'What is Vue.js?',
        content: 'Vue.js is a progressive JavaScript framework for building user interfaces. It is designed to be incrementally adoptable.'
    },
    {
        id: 'item-2',
        title: 'What is Nuxt?',
        content: 'Nuxt is a powerful framework built on top of Vue.js that provides server-side rendering, static site generation, and more.'
    },
    {
        id: 'item-3',
        title: 'What is PandaCSS?',
        content: 'PandaCSS is a CSS-in-JS engine that generates atomic CSS at build time, providing type-safe styling with excellent performance.'
    }
]

// Rich content items with HTML
const richContentItems = [
    {
        icon: 'star',
        id: 'rich-1',
        title: '<strong>Bold Title</strong> with formatting',
        content: `
            <div>
                <p><strong>This is bold text</strong> and <em>this is italic</em>.</p>
                <ul>
                    <li>List item one</li>
                    <li>List item two</li>
                    <li>List item three</li>
                </ul>
            </div>
        `
    },
    {
        icon: 'code',
        id: 'rich-2',
        title: 'Item with <code>code</code> example',
        content: `
            <div>
                <p>Here's a code example:</p>
                <pre><code>const greeting = "Hello World"
console.log(greeting)</code></pre>
            </div>
        `
    }
]

// FAQ style items
const faqItems = [
    {
        id: 'faq-1',
        title: 'How do I get started?',
        content: 'To get started, simply install the package using your preferred package manager and import the components you need.'
    },
    {
        id: 'faq-2',
        title: 'Is this component accessible?',
        content: 'Yes! The accordion component is built with accessibility in mind, using proper ARIA attributes and keyboard navigation support.'
    },
    {
        id: 'faq-3',
        title: 'Can I customize the styling?',
        content: 'Absolutely! The component uses PandaCSS for styling, which provides extensive customization options through design tokens.'
    },
    {
        id: 'faq-4',
        title: 'Does it support mobile devices?',
        content: 'Yes, the accordion component is fully responsive and works seamlessly on mobile, tablet, and desktop devices.'
    }
]

// Multiple items for scalability demonstration
const multipleItems = [
    {
        id: 'multi-1',
        title: 'Section 1: Introduction',
        content: 'This is the first section of our comprehensive guide.'
    },
    {
        id: 'multi-2',
        title: 'Section 2: Getting Started',
        content: 'Learn how to set up your development environment.'
    },
    {
        id: 'multi-3',
        title: 'Section 3: Basic Concepts',
        content: 'Understand the fundamental concepts before diving deeper.'
    },
    {
        id: 'multi-4',
        title: 'Section 4: Advanced Topics',
        content: 'Explore advanced features and best practices.'
    },
    {
        id: 'multi-5',
        title: 'Section 5: Troubleshooting',
        content: 'Common issues and their solutions.'
    },
    {
        id: 'multi-6',
        title: 'Section 6: Best Practices',
        content: 'Learn industry best practices for optimal results.'
    }
]
</script>
