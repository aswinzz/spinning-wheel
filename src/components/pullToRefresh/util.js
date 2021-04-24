function isOverflowScrollable(element) {
    const overflowType = getComputedStyle(element).overflowY;
    if (element === document.scrollingElement && overflowType === 'visible') {
      return true;
    }
  
    if (overflowType !== 'scroll' && overflowType !== 'auto') {
      return false;
    }
  
    return true;
  }
  
  function isScrollable(element, direction) {
    if (!isOverflowScrollable(element)) {
      return false;
    }
  
    if (direction === 0b01) {
      const bottomScroll = element.scrollTop + element.clientHeight;
      return bottomScroll < element.scrollHeight;
    }
  
    if (direction === -0b01) {
      return element.scrollTop > 0;
    }
  
    throw new Error('unsupported direction');
  }
  
  /**
   * Returns whether a given element or any of its ancestors (up to rootElement) is scrollable in a given direction.
   */
  export function isTreeScrollable(element, direction) {
    if (isScrollable(element, direction)) {
      return true;
    }
  
    if (element.parentElement == null) {
      return false;
    }
  
    return isTreeScrollable(element.parentElement, direction);
  }