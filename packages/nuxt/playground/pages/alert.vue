<template>
    <ShowcaseContainer>
        <WfAlertRoot 
            :messages="[{
                title: 'test',
                description: 'this is a test alert'
            }]"
        />
        <WfAlertRoot 
            variant="danger"
            :messages="[{
                title: 'test',
                description: 'this is a test alert'
            }]"
        />
        <WfAlertRoot 
            variant="success"
            :messages="[{
                title: 'test',
                description: 'this is a test alert'
            }]"
        />
        <WfAlertRoot 
            variant="warning"
            border-size="xl"
            :messages="[{
                title: 'test',
                description: 'this is a test alert'
            }]"
        />
        <WfAlertRoot
            hide-icon
            variant="info"
            :messages="[{
                title: 'No icon',
                description: 'The icon slot is omitted, including its gap.'
            }]"
        />
    </ShowcaseContainer>
</template>