import Vue from 'vue'
import Vuetify from 'vuetify'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { getVuexStore } from '@/store'
import ConsentContinuationOut from '@/views/ConsentContinuationOut.vue'
import { ConfirmDialog, PaymentErrorDialog, ResumeErrorDialog, SaveErrorDialog, StaffPaymentDialog }
  from '@/components/dialogs'
import { Certify, DetailComment } from '@/components/common'
import { CourtOrderPoa } from '@bcrs-shared-components/court-order-poa'
import { DocumentDelivery } from '@bcrs-shared-components/document-delivery'
import mockRouter from './mockRouter'
import VueRouter from 'vue-router'

Vue.use(Vuetify)

const store = getVuexStore() as any // remove typings for unit tests
const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Consent to Continuation Out view', () => {
  beforeEach(() => {
    // init store
    store.state.currentDate = '2020-03-04'
    store.commit('setLegalType', 'CP')
    store.commit('setLegalName', 'My Test Entity')
    store.commit('setIdentifier', 'CP1234567')
    store.commit('setFoundingDate', '1971-05-12T00:00:00-00:00')
    store.state.filingData = []
    store.state.keycloakRoles = ['staff'] // consent to continuation outs currently apply to staff only
  })

  it('mounts the sub-components properly', async () => {
    const $route = { params: { filingId: '0' } }

    // create local Vue and mock router
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const $router = mockRouter.mock()

    const wrapper = shallowMount(ConsentContinuationOut, { store, mocks: { $route, $router } })
    wrapper.vm.$data.dataLoaded = true
    await Vue.nextTick()

    // verify sub-components
    expect(wrapper.findComponent(Certify).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmDialog).exists()).toBe(true)
    expect(wrapper.findComponent(CourtOrderPoa).exists()).toBe(true)
    expect(wrapper.findComponent(DetailComment).exists()).toBe(true)
    expect(wrapper.findComponent(DocumentDelivery).exists()).toBe(true)
    expect(wrapper.findComponent(PaymentErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(ResumeErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(SaveErrorDialog).exists()).toBe(true)
    expect(wrapper.findComponent(StaffPaymentDialog).exists()).toBe(true)
    wrapper.destroy()
  })

  it('sets filing data properly', async () => {
    const $route = { params: { filingId: '0' } }

    // create local Vue and mock router
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const $router = mockRouter.mock()

    const wrapper = shallowMount(ConsentContinuationOut, { store, mocks: { $route, $router } })
    wrapper.vm.$data.dataLoaded = true
    await Vue.nextTick()

    const vm: any = wrapper.vm

    // verify initial Filing Data
    expect(vm.filingData).not.toBeUndefined()
    expect(vm.filingData).not.toBeNull()
    expect(vm.filingData.length).toBe(1)
    expect(vm.filingData[0].filingTypeCode).toBe('CONTO')
    expect(vm.filingData[0].entityType).toBe('CP')
    wrapper.destroy()
  })

  it('sets computed states properly', () => {
    // mock $route
    const $route = { params: { filingId: '0' } }

    // create local Vue and mock router
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const $router = mockRouter.mock()

    const wrapper = shallowMount(ConsentContinuationOut, { store, mocks: { $route, $router } })
    const vm: any = wrapper.vm

    // verify "isPayRequired" with no fee
    vm.totalFee = 0
    expect(!!vm.isPayRequired).toBe(false)

    // verify "isPayRequired" with a fee
    vm.totalFee = 350
    expect(!!vm.isPayRequired).toBe(true)

    // verify "validated" - all true
    vm.certifyFormValid = true
    vm.courtOrderValid = true
    vm.detailCommentValid = true
    vm.documentDeliveryValid = true
    expect(!!vm.isPageValid).toBe(true)

    // verify "validated" - invalid Detail Comment form
    vm.certifyFormValid = true
    vm.courtOrderValid = true
    vm.detailCommentValid = false
    vm.documentDeliveryValid = true
    expect(!!vm.isPageValid).toBe(false)

    // verify "validated" - invalid Certify form
    vm.certifyFormValid = false
    vm.courtOrderValid = true
    vm.detailCommentValid = true
    vm.documentDeliveryValid = true
    expect(!!vm.isPageValid).toBe(false)

    // verify "validated" - invalid Court Order form
    vm.certifyFormValid = true
    vm.courtOrderValid = false
    vm.detailCommentValid = true
    vm.documentDeliveryValid = true
    expect(!!vm.isPageValid).toBe(false)

    // verify "validated" - invalid Document Delivery form
    vm.certifyFormValid = true
    vm.courtOrderValid = true
    vm.detailCommentValid = true
    vm.documentDeliveryValid = false
    expect(!!vm.isPageValid).toBe(false)

    wrapper.destroy()
  })
})
