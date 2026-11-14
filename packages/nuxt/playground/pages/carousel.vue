<template>
    <ShowcaseContainer>
        <!-- Basic Carousel -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Basic Carousel
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                A simple carousel with navigation controls. Scroll mode: "item" (default).
            </p>
            
            <WfCarouselRoot>
                <WfCarouselItem v-for="i in 6" :key="i">
                    <WfCardRoot>
                        <WfCardBody>
                            <div :class="css({ 
                                minWidth: '250px',
                                height: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2xl',
                                fontWeight: 'bold'
                            })">
                                Item {{ i }}
                            </div>
                        </WfCardBody>
                    </WfCardRoot>
                </WfCarouselItem>

                <template #carousel-after>
                    <WfCarouselNavigation>
                        <template #action-prev="{ handlePrev, disabled }">
                            <WfButton 
                                label="← Previous"
                                color="secondary"
                                size="sm"
                                :disabled="disabled"
                                @click="handlePrev"
                            />
                        </template>
                        <template #action-next="{ handleNext, disabled }">
                            <WfButton 
                                label="Next →"
                                color="primary"
                                size="sm"
                                :disabled="disabled"
                                @click="handleNext"
                            />
                        </template>
                    </WfCarouselNavigation>
                </template>
            </WfCarouselRoot>
        </div>

        <!-- Viewport Scroll Mode Carousel -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Viewport Scroll Mode
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Carousel with scroll-mode="viewport" scrolls by viewport width instead of item width.
            </p>
            
            <WfCarouselRoot scroll-mode="viewport">
                <WfCarouselItem v-for="i in 8" :key="i">
                    <WfCardRoot>
                        <WfCardBody>
                            <div :class="css({ 
                                minWidth: '200px',
                                height: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'sm'
                            })">
                                <div :class="css({ 
                                    fontSize: '3xl',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: 'full',
                                    bg: 'primary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                })">
                                    {{ i }}
                                </div>
                                <span :class="css({ fontSize: 'sm', color: 'text.muted' })">
                                    Card {{ i }}
                                </span>
                            </div>
                        </WfCardBody>
                    </WfCardRoot>
                </WfCarouselItem>

                <template #carousel-after>
                    <div :class="css({ display: 'flex', gap: 'sm', justifyContent: 'center', marginTop: 'md' })">
                        <WfCarouselNavigation>
                            <template #action-prev="{ handlePrev, disabled }">
                                <WfButton 
                                    label="←"
                                    color="secondary"
                                    size="sm"
                                    :disabled="disabled"
                                    @click="handlePrev"
                                />
                            </template>
                            <template #action-next="{ handleNext, disabled }">
                                <WfButton 
                                    label="→"
                                    color="primary"
                                    size="sm"
                                    :disabled="disabled"
                                    @click="handleNext"
                                />
                            </template>
                        </WfCarouselNavigation>
                    </div>
                </template>
            </WfCarouselRoot>
        </div>

        <!-- Custom Styled Carousel -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Custom Styled Carousel
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                Carousel with custom styles through the <code>css</code> prop (<code>root</code> and <code>viewport</code> slots).
            </p>
            
            <WfCarouselRoot 
                :css="{ root: css.raw({ 
                    padding: 'xl', 
                    bg: { base: 'black/17.5', _dark: 'white/10', _osDark: 'white/10' },
                    borderRadius: 'xl'
                }), viewport: css.raw({
                    gap: 'xl',
                    padding: 'lg'
                }) }">
                <WfCarouselItem v-for="i in 5" :key="i">
                    <div :class="css({ 
                        minWidth: '300px',
                        height: '250px',
                        bg: 'surface',
                        borderRadius: 'lg',
                        padding: 'xl',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '1px solid',
                        borderColor: 'border'
                    })">
                        <div>
                            <h3 :class="css({ fontSize: 'xl', fontWeight: 'bold', marginBottom: 'sm' })">
                                Feature {{ i }}
                            </h3>
                            <p :class="css({ fontSize: 'sm', color: 'text.muted' })">
                                This is a custom styled carousel item with more detailed content and styling.
                            </p>
                        </div>
                        <WfButton 
                            label="Learn More"
                            color="primary"
                            size="sm"
                        />
                    </div>
                </WfCarouselItem>

                <template #carousel-before>
                    <div :class="css({ marginBottom: 'md' })">
                        <h3 :class="css({ fontSize: 'lg', fontWeight: 'semibold' })">
                            Featured Items
                        </h3>
                    </div>
                </template>

                <template #carousel-after>
                    <div :class="css({ 
                        display: 'flex', 
                        gap: 'md', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'md'
                    })">
                        <span :class="css({ fontSize: 'sm', color: 'text.muted' })">
                            Swipe or use arrows to navigate
                        </span>
                        <WfCarouselNavigation>
                            <template #action-prev="{ handlePrev, disabled }">
                                <WfButton 
                                    label="Back"
                                    color="secondary"
                                    size="sm"
                                    :disabled="disabled"
                                    @click="handlePrev"
                                />
                            </template>
                            <template #action-next="{ handleNext, disabled }">
                                <WfButton 
                                    label="Next"
                                    color="primary"
                                    size="sm"
                                    :disabled="disabled"
                                    @click="handleNext"
                                />
                            </template>
                        </WfCarouselNavigation>
                    </div>
                </template>
            </WfCarouselRoot>
        </div>

        <!-- Compact Carousel (Many Items) -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Compact Carousel
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
                A carousel with many smaller items, useful for tags, badges, or thumbnails.
            </p>
            
            <WfCarouselRoot>
                <WfCarouselItem v-for="i in 15" :key="i">
                    <div :class="css({ 
                        minWidth: '120px',
                        height: '80px',
                        bg: i % 3 === 0 ? 'primary' : { base: 'black/25', _dark: 'white/10', _osDark: 'white/10' },
                        borderRadius: 'md',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'semibold',
                        fontSize: 'lg'
                    })">
                        {{ i }}
                    </div>
                </WfCarouselItem>

                <template #carousel-after>
                    <div :class="css({ display: 'flex', gap: 'sm', marginTop: 'md' })">
                        <WfCarouselNavigation>
                            <template #action-prev="{ handlePrev, disabled }">
                                <WfButton 
                                    label="←"
                                    color="secondary"
                                    size="sm"
                                    :disabled="disabled"
                                    @click="handlePrev"
                                />
                            </template>
                            <template #action-next="{ handleNext, disabled }">
                                <WfButton 
                                    label="→"
                                    color="primary"
                                    size="sm"
                                    :disabled="disabled"
                                    @click="handleNext"
                                />
                            </template>
                        </WfCarouselNavigation>
                    </div>
                </template>
            </WfCarouselRoot>
        </div>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css';
</script>
