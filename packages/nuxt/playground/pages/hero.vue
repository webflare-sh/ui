<template>
    <ShowcaseContainer>
        <!-- Basic Hero - Medium Size (Default) -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Basic Hero (Medium Size)
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Default hero section with headline and description. Size: "md" (default).
            </p>
            
            <WfHeroLead
                headline="Welcome to <mark>Webflare</mark> UI"
                description="A modern, type-safe design system built with Vue 3 and PandaCSS. Create beautiful interfaces with confidence."
            >
                <template #actions>
                    <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                        <WfButton label="Get Started" color="primary" size="md" />
                        <WfButton label="View Documentation" color="secondary" size="md" />
                    </div>
                </template>
            </WfHeroLead>
        </div>

        <!-- Small Hero -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Small Hero
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Compact hero section with size="sm" for smaller sections or secondary pages.
            </p>
            
            <WfHeroLead
                size="sm"
                headline="Small Section Hero"
                description="Perfect for sub-pages or sections that need less visual weight."
            >
                <template #actions>
                    <WfButton label="Learn More" color="primary" size="sm" />
                </template>
            </WfHeroLead>
        </div>

        <!-- Large Hero -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Large Hero
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Large, impactful hero section with size="lg" for landing pages and main sections.
            </p>
            
            <WfHeroLead
                size="lg"
                headline="Build <strong>Amazing</strong> Products"
                description="The complete design system for modern web applications. Fully responsive, theme-aware, and built with developer experience in mind."
            >
                <template #actions>
                    <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                        <WfButton label="Start Building" color="primary" size="lg" />
                        <WfButton label="Explore Components" color="secondary" size="lg" />
                    </div>
                </template>
            </WfHeroLead>
        </div>

        <!-- Center Aligned Hero -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Center Aligned Hero
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero section with center alignment using alignItems="center".
            </p>
            
            <WfHeroLead
                align-items="center"
                headline="Centered <mark>Hero</mark> Section"
                description="Perfect for landing pages and marketing content where you want to draw attention to the center."
            >
                <template #actions>
                    <div :class="css({ display: 'flex', gap: 'md', justifyContent: 'center', flexWrap: 'wrap' })">
                        <WfButton label="Get Started" color="primary" size="md" />
                        <WfButton label="Learn More" color="secondary" size="md" />
                    </div>
                </template>
            </WfHeroLead>
        </div>

        <!-- End Aligned Hero -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                End Aligned Hero
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero section with end (right) alignment using alignItems="end".
            </p>
            
            <WfHeroLead
                align-items="end"
                headline="Right-Aligned Content"
                description="Useful for specific layouts or directional design patterns."
            >
                <template #actions>
                    <WfButton label="Take Action" color="primary" size="md" />
                </template>
            </WfHeroLead>
        </div>

        <!-- Hero with Custom Headline Tag -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Custom Headline Tag
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero using headlineTag="h2" for proper semantic hierarchy in sub-sections.
            </p>
            
            <WfHeroLead
                headline-tag="h2"
                headline="Semantic <mark>HTML</mark> Structure"
                description="Control the headline tag for proper document structure and accessibility."
            >
                <template #actions>
                    <WfButton label="Explore" color="primary" size="md" />
                </template>
            </WfHeroLead>
        </div>

        <!-- Hero with Custom Slots -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Custom Slot Content
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero using custom slot content instead of props for maximum flexibility.
            </p>
            
            <WfHeroLead>
                <template #headline>
                    <h1 :class="css({ 
                        fontSize: { base: '2xl', xl: '3xl' },
                        fontWeight: 'bold',
                        textWrap: 'balance',
                        lineHeight: '1.25'
                    })">
                        Custom <span :class="css({ color: 'primary' })">Headline</span> Slot
                    </h1>
                </template>
                
                <template #description>
                    <div :class="css({ 
                        fontSize: { base: 'md', md: 'lg' },
                        color: 'grey.300',
                        _light: { color: 'grey.700' },
                        textWrap: 'balance'
                    })">
                        You can use slots for complete control over the content and styling. This allows for:
                        <ul :class="css({ marginTop: 'sm', marginLeft: 'lg', listStylePosition: 'outside' })">
                            <li>Custom HTML structure</li>
                            <li>Additional interactive elements</li>
                            <li>Complex layouts</li>
                        </ul>
                    </div>
                </template>
                
                <template #actions>
                    <div :class="css({ display: 'flex', gap: 'sm', flexWrap: 'wrap', alignItems: 'center' })">
                        <WfButton label="Primary Action" color="primary" size="md" />
                        <WfButton label="Secondary Action" color="secondary" size="md" />
                        <span :class="css({ fontSize: 'sm', color: 'grey.300', _light: { color: 'grey.700' } })">
                            or <a href="#" :class="css({ textDecoration: 'underline', color: 'primary' })">learn more</a>
                        </span>
                    </div>
                </template>
            </WfHeroLead>
        </div>

        <!-- Hero in a Card -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Hero in a Card
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero component can be composed with other components like Card for enhanced layouts.
            </p>
            
            <WfCardRoot>
                <WfCardBody>
                    <WfHeroLead
                        size="sm"
                        align-items="center"
                        headline="Featured <strong>Announcement</strong>"
                        description="Important updates and news about our platform. Stay informed about the latest features and improvements."
                    >
                        <template #actions>
                            <div :class="css({ display: 'flex', gap: 'sm', justifyContent: 'center', flexWrap: 'wrap' })">
                                <WfButton label="Read More" color="primary" size="sm" />
                                <WfButton label="Dismiss" color="secondary" size="sm" />
                            </div>
                        </template>
                    </WfHeroLead>
                </WfCardBody>
            </WfCardRoot>
        </div>

        <!-- Full-Width Hero with Background -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Styled Hero Container
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero wrapped in a styled container for visual impact.
            </p>
            
            <div :class="css({ 
                padding: { base: 'xl', md: '2xl' },
                borderRadius: 'xl',
                bg: 'lucid.50',
                border: '1px solid',
                borderColor: 'lucid.100',
                _light: { borderColor: 'lucid.300', bg: 'lucid.100' }
            })">
                <WfHeroLead
                    size="lg"
                    align-items="center"
                    headline="Transform Your <mark>Development</mark> Experience"
                    description="Join thousands of developers building better products with our design system. Fast, flexible, and fully customizable."
                >
                    <template #actions>
                        <div :class="css({ display: 'flex', gap: 'md', justifyContent: 'center', flexWrap: 'wrap' })">
                            <WfButton label="Start Free Trial" color="primary" size="lg" />
                            <WfButton label="View Pricing" color="secondary" size="lg" />
                        </div>
                    </template>
                </WfHeroLead>
            </div>
        </div>

        <!-- Multiple CTAs Hero -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Multiple Call-to-Actions
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Hero with multiple action buttons and additional information.
            </p>
            
            <WfHeroLead
                headline="Ready to <strong>Get Started</strong>?"
                description="Choose the plan that's right for you and start building amazing products today."
            >
                <template #actions>
                    <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'md' })">
                        <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })">
                            <WfButton label="Start Free" color="primary" size="md" />
                            <WfButton label="Contact Sales" color="secondary" size="md" />
                            <WfButton label="View Demo" color="transparent" size="md" />
                        </div>
                        <p :class="css({ 
                            fontSize: 'xs', 
                            color: 'grey.300', 
                            _light: { color: 'grey.700' } 
                        })">
                            No credit card required • Cancel anytime • 14-day free trial
                        </p>
                    </div>
                </template>
            </WfHeroLead>
        </div>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css';
</script>
