export const kitchenEvents = new EventTarget();

export const emitKitchenUpdate = () => {
  kitchenEvents.dispatchEvent(new Event("kitchen-updated"));
};
