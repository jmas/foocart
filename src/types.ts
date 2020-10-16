import { TemplateResult } from 'lit-html';

export type OrderItemIDType = string | number;

export enum SectionType {
  BUTTON = 'button',
  CART = 'cart',
  ORDER = 'order',
  COMPLETE = 'complete'
};

export interface IOrder {
  items: Array<IOrderItem>,
  name: string,
  surname: string,
  email: string,
  telephone: string
};

export interface IOrderItem {
  id: string,
  name: string,
  url: string,
  count: number,
  image: string,
  price: number
};

export interface IProps {
  priceTemplate: string,
  completeOrder(order: IOrder): Promise<IOrderResult>,
  onUpdate(cart:ICart, output: IOutput): void
};

export interface ITranslation {
  [key: string]: string
};

export interface IOutput {
  items: Array<IOrderItem>,
  orderResult: IOrderResult,
  section: SectionType,
  totalPrice: number
};

export interface IOrderResult {
  message: string | null,
  success: boolean,
  completed: boolean,
  pending: boolean,
  errors: { [key: string]: string } | null
};

export interface ICart {
  props: IProps,
  items: Array<IOrderItem>,
  orderResult: IOrderResult,
  section: SectionType,
  update(): void,
  completeOrder(order: IOrder): void,
  addItem(item: IOrderItem): IOrderItem,
  addItemCount(id: OrderItemIDType, count?: number): void,
  removeItem(id: OrderItemIDType): void,
  removeItemCount(id: OrderItemIDType, count?: number): void,
  removeAllItems(): void,
  getItems(): Array<IOrderItem>,
  setSection(section: SectionType): void,
  getTotalPrice(): number
};

export interface IFieldProps {
  label: string,
  name: string,
  input?: TemplateResult,
  error?: string
};

export interface ITextFieldProps extends IFieldProps {
  type?: string
};

export interface ITextareaFieldProps extends IFieldProps {};

export interface IDialogProps {
  content: TemplateResult,
  translation: ITranslation,
  onClose(): void;
};
