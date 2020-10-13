import { ICart, IProps, IOrderItem, IOrderResult, SectionType, OrderItemIDType, IOrder } from './types';
import { createOrderResult } from './helpers';

export default class Cart implements ICart {
  props: IProps;
  items: Array<IOrderItem> = [];
  orderResult: IOrderResult;
  section: SectionType = SectionType.BUTTON;

  constructor(props: IProps) {
    this.props = props;
    this.orderResult = createOrderResult();
    this.update();
  }

  update() {
    this.props.onUpdate(this, {
      items: this.items,
      orderResult: this.orderResult,
      section: this.section,
      totalPrice: this.getTotalPrice()
    });
  }

  completeOrder(order: IOrder) {
    this.orderResult = createOrderResult({
        success: false,
        completed: false,
        pending: true,
        errors: null
    });
    this.update();
    this.props.completeOrder(order)
        .then((result: IOrderResult) => {
            this.orderResult = createOrderResult({
                ...result,
                pending: false
            });
            if (result.success) {
                this.items = [];
                this.setSection(SectionType.COMPLETE);
            } else {
                this.update();
            }
        })
        .catch(() => {
            this.orderResult = createOrderResult({
                message: 'Oops! Something went wrong. Please try again',
                pending: false
            });
            this.update();
        });
  }
  
  addItem(item: IOrderItem) {
    const foundItem = this.items.find(findItem => findItem.id === item.id);
    if (foundItem) {
        this.addItemCount(item.id);
        return item;
    }
    this.items.push(item);
    this.update();
    return item;
  }

  addItemCount(id: OrderItemIDType, count: number = 1) {
    this.items = this.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          count: item.count + count
        };
      }
      return item;
    });
    this.update();
  }
  
  removeItem(id: OrderItemIDType) {
    this.items = this.items.filter(item => item.id !== id);
    this.update();
  }

  removeItemCount(id: OrderItemIDType, count: number = 1) {
    this.items = this.items.map(item => {
        if (item.id === id) {
            return {
                ...item,
                count: item.count - count >= 0 ? item.count - count : 1
            };
        }
        return item;
    });
    this.update();
  }
  
  removeAllItems() {
    this.items = [];
    this.update();
  }
  
  getItems() {
    return this.items;
  }

  setSection(section: SectionType) {
    this.section = section;
    this.update();
  }

  getTotalPrice() {
    return this.items.reduce((acc, item) => {
        return acc + item.count * item.price;
    }, 0);
  }
}
