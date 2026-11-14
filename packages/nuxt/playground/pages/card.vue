
<template>
    <ShowcaseContainer>
        <WfCardRoot>
            <template #header>
                <WfCardHeader
                    title="Card Title"
                    subtitle="Card Subtitle"
                >
                <template #icon>
                    <span class="icon icon-info-bold" />
                </template>
                </WfCardHeader>
            </template>
            <WfCardBody>
                <p>This is the body of the card. It contains the main content.</p>
                <WfListRoot 
                    state="danger"
                    size="md"
                    :items="[
                        { content: 'First item' },
                        { content: 'Second item' },
                        { content: 'Third <b>bold</b> item' }
                    ]"/>
            </WfCardBody>
        </WfCardRoot>
    </ShowcaseContainer>
</template>

<script setup lang="ts">
</script>
