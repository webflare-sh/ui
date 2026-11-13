// Implementation sources for the published `@webflare/ui/vue/<Name>` modules.
// `write-vue-entry-modules.ts` generates `src/vue/<Name>.ts` from this catalog
// so Vite and vue-tsc compile the same entry (JS + .d.ts at `dist/vue/<Name>`).
export const vueLibEntries = {
  AccordionRoot: 'src/components/Accordion/AccordionRoot.vue',
  AlertRoot: 'src/components/Alert/AlertRoot.vue',
  BadgeRoot: 'src/components/Badge/BadgeRoot.vue',
  Button: 'src/components/Button/Button.vue',
  CardRoot: 'src/components/Card/CardRoot.vue',
  CardBody: 'src/components/Card/CardBody.vue',
  CardHeader: 'src/components/Card/CardHeader.vue',
  CarouselRoot: 'src/components/Carousel/CarouselRoot.vue',
  CarouselItem: 'src/components/Carousel/CarouselItem.vue',
  CarouselNavigation: 'src/components/Carousel/CarouselNavigation.vue',
  DialogRoot: 'src/components/Dialog/DialogRoot.vue',
  FieldInput: 'src/components/Field/FieldInput.vue',
  FieldTextarea: 'src/components/Field/FieldTextarea.vue',
  FieldSelect: 'src/components/Field/FieldSelect.vue',
  FieldCheckbox: 'src/components/Field/FieldCheckbox.vue',
  FieldRadioGroup: 'src/components/Field/FieldRadioGroup.vue',
  FieldSwitch: 'src/components/Field/FieldSwitch.vue',
  FieldUrl: 'src/components/Field/FieldUrl.vue',
  FieldBase: 'src/components/Field/FieldBase.vue',
  FieldLabel: 'src/components/Field/FieldLabel.vue',
  FieldError: 'src/components/Field/FieldError.vue',
  FieldMessage: 'src/components/Field/FieldMessage.vue',
  FieldRequired: 'src/components/Field/FieldRequired.vue',
  FlyoutRoot: 'src/components/Flyout/FlyoutRoot.vue',
  FlyoutDropdown: 'src/components/Flyout/FlyoutDropdown.vue',
  FormPrompt: 'src/components/Form/FormPrompt.vue',
  FormPromptFooter: 'src/components/Form/FormPromptFooter.vue',
  HeroLead: 'src/components/Hero/HeroLead.vue',
  ListRoot: 'src/components/List/ListRoot.vue',
  ListItem: 'src/components/List/ListItem.vue',
  Loader: 'src/components/Loader/Loader.vue',
  PricingCardRoot: 'src/components/PricingCard/PricingCardRoot.vue',
  PricingCardHeader: 'src/components/PricingCard/PricingCardHeader.vue',
  PricingCardPricing: 'src/components/PricingCard/PricingCardPricing.vue',
  PricingCardBody: 'src/components/PricingCard/PricingCardBody.vue',
  PricingCardBadge: 'src/components/PricingCard/PricingCardBadge.vue',
  ProgressRoot: 'src/components/Progress/ProgressRoot.vue',
  SwitchRoot: 'src/components/Switch/SwitchRoot.vue',
  TabRoot: 'src/components/Tab/TabRoot.vue',
  TabItem: 'src/components/Tab/TabItem.vue',
  useCarousel: 'src/composables/carousel.ts',
  useFlyout: 'src/composables/flyout.ts',
  useFormData: 'src/composables/form.ts',
} as const

export type VueLibEntryName = keyof typeof vueLibEntries

export const nuxtComposables = ['useCarousel', 'useFlyout', 'useFormData'] as const satisfies readonly VueLibEntryName[]

const composableNames = new Set<string>(nuxtComposables)

/** Nuxt registers every component entry under its own name (plus the module prefix). */
export const nuxtComponents: Record<string, VueLibEntryName> = Object.fromEntries(
  (Object.keys(vueLibEntries) as VueLibEntryName[])
    .filter(name => !composableNames.has(name))
    .map(name => [name, name]),
)
