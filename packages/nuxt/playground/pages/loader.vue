<template>
    <ShowcaseContainer>
        <!-- Basic Loader -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Basic Loader
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Default loader with default size (40px) and label.
            </p>
            
            <WfLoader />
        </div>

        <!-- Loader Sizes -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Loader Sizes
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Loaders can be customized to any size using the size prop (in pixels).
            </p>
            
            <div :class="css({ display: 'flex', gap: 'xl', alignItems: 'center', flexWrap: 'wrap' })">
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="24" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        24px
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="32" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        32px
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="40" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        40px (default)
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="56" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        56px
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="80" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        80px
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="120" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        120px
                    </span>
                </div>
            </div>
        </div>

        <!-- Custom Label -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Custom Label
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Customize the aria-label for accessibility using the label prop.
            </p>
            
            <div :class="css({ display: 'flex', gap: 'xl', alignItems: 'center', flexWrap: 'wrap' })">
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader label="Processing..." />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        Processing...
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader label="Uploading files" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        Uploading files
                    </span>
                </div>
                
                <div :class="css({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'sm' })">
                    <WfLoader label="Please wait" />
                    <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' } })">
                        Please wait
                    </span>
                </div>
            </div>
        </div>

        <!-- Loader in Card -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Loader in Card
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Loader used in a card layout to indicate loading state.
            </p>
            
            <WfCardRoot>
                <WfCardBody>
                    <div :class="css({ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 'lg',
                        padding: 'xl',
                        minHeight: '200px'
                    })">
                        <WfLoader :size="60" label="Loading content" />
                        <p :class="css({ fontSize: 'md', color: 'grey.300', _light: { color: 'grey.700' } })">
                            Loading content...
                        </p>
                    </div>
                </WfCardBody>
            </WfCardRoot>
        </div>

        <!-- Centered Loader -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Centered Full-Width
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Loader centered in a full-width container for page loading states.
            </p>
            
            <div :class="css({ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                minHeight: '300px',
                bg: 'lucid.50',
                _light: { bg: 'lucid.100' },
                borderRadius: 'xl'
            })">
                <WfLoader :size="80" label="Loading page" />
            </div>
        </div>

        <!-- Inline with Text -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Inline with Text
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Small loaders can be used inline with text.
            </p>
            
            <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'md' })">
                <div :class="css({ display: 'flex', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="16" />
                    <span :class="css({ fontSize: 'sm' })">Processing your request...</span>
                </div>
                
                <div :class="css({ display: 'flex', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="20" />
                    <span :class="css({ fontSize: 'md' })">Saving changes...</span>
                </div>
                
                <div :class="css({ display: 'flex', alignItems: 'center', gap: 'sm' })">
                    <WfLoader :size="24" />
                    <span :class="css({ fontSize: 'lg' })">Loading data...</span>
                </div>
            </div>
        </div>

        <!-- Loading Button States -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Loading Button States
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Simulated loading states in button layouts.
            </p>
            
            <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg' })">
                <!-- Small buttons -->
                <div>
                    <h4 :class="css({ fontSize: 'md', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Small Buttons
                    </h4>
                    <div :class="css({ display: 'flex', gap: 'sm', flexWrap: 'wrap' })">
                        <button 
                            :class="css({ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'sm',
                                padding: 'xs lg',
                                bg: 'primary',
                                color: 'grey.night',
                                _light: { color: 'white' },
                                borderRadius: 'lg',
                                border: '1px solid',
                                borderColor: 'primary',
                                fontSize: 'sm',
                                fontWeight: '600',
                                cursor: 'not-allowed',
                                opacity: 0.7
                            })"
                            disabled
                        >
                            <WfLoader :size="16" />
                            <span>Loading...</span>
                        </button>
                        
                        <WfButton label="Not Loading" color="secondary" size="sm" />
                    </div>
                </div>

                <!-- Medium buttons -->
                <div>
                    <h4 :class="css({ fontSize: 'md', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Medium Buttons
                    </h4>
                    <div :class="css({ display: 'flex', gap: 'sm', flexWrap: 'wrap' })">
                        <button 
                            :class="css({ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'sm',
                                padding: 'sm lg',
                                bg: 'primary',
                                color: 'grey.night',
                                _light: { color: 'white' },
                                borderRadius: 'lg',
                                border: '1px solid',
                                borderColor: 'primary',
                                fontSize: 'md',
                                fontWeight: '600',
                                cursor: 'not-allowed',
                                opacity: 0.7
                            })"
                            disabled
                        >
                            <WfLoader :size="20" />
                            <span>Processing...</span>
                        </button>
                        
                        <WfButton label="Ready" color="secondary" size="md" />
                    </div>
                </div>

                <!-- Large buttons -->
                <div>
                    <h4 :class="css({ fontSize: 'md', fontWeight: 'semibold', marginBottom: 'sm' })">
                        Large Buttons
                    </h4>
                    <div :class="css({ display: 'flex', gap: 'sm', flexWrap: 'wrap' })">
                        <button 
                            :class="css({ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'md',
                                padding: 'md xl',
                                bg: 'primary',
                                color: 'grey.night',
                                _light: { color: 'white' },
                                borderRadius: 'lg',
                                border: '1px solid',
                                borderColor: 'primary',
                                fontSize: 'lg',
                                fontWeight: '600',
                                cursor: 'not-allowed',
                                opacity: 0.7
                            })"
                            disabled
                        >
                            <WfLoader :size="24" />
                            <span>Uploading...</span>
                        </button>
                        
                        <WfButton label="Complete" color="secondary" size="lg" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Multiple Loaders -->
        <div>
            <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
                Multiple Loading States
            </h2>
            <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
                Multiple loaders for different sections loading independently.
            </p>
            
            <div :class="css({ display: 'grid', gridTemplateColumns: { base: '1', md: '2', lg: '3' }, gap: 'lg' })">
                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: 'md',
                            padding: 'md',
                            minHeight: '150px',
                            justifyContent: 'center'
                        })">
                            <WfLoader :size="40" label="Loading user data" />
                            <span :class="css({ fontSize: 'sm', color: 'grey.300', _light: { color: 'grey.700' } })">
                                Loading user data...
                            </span>
                        </div>
                    </WfCardBody>
                </WfCardRoot>

                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: 'md',
                            padding: 'md',
                            minHeight: '150px',
                            justifyContent: 'center'
                        })">
                            <WfLoader :size="40" label="Loading statistics" />
                            <span :class="css({ fontSize: 'sm', color: 'grey.300', _light: { color: 'grey.700' } })">
                                Loading statistics...
                            </span>
                        </div>
                    </WfCardBody>
                </WfCardRoot>

                <WfCardRoot>
                    <WfCardBody>
                        <div :class="css({ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: 'md',
                            padding: 'md',
                            minHeight: '150px',
                            justifyContent: 'center'
                        })">
                            <WfLoader :size="40" label="Loading activities" />
                            <span :class="css({ fontSize: 'sm', color: 'grey.300', _light: { color: 'grey.700' } })">
                                Loading activities...
                            </span>
                        </div>
                    </WfCardBody>
                </WfCardRoot>
            </div>
        </div>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css';
</script>
