export { useCustomerStore, type CustomerStore } from './customer.store';
export {
  customerNoteSchema,
  type CustomerNoteSchema,
} from './customer.schemas';
export {
  buildInitialCustomers,
  filterCustomers,
  sortCustomers,
  getCustomerDashboardStats,
  getCustomersChartData,
  getOrderNumbersByCustomer,
  CUSTOMER_PAGE_SIZE,
} from './customer.utils';
