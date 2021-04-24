import React, { useRef, useEffect } from 'react';
import { isTreeScrollable } from './util';
import './styles.css';

export default (props)  => {
  const containerRef = useRef(null);
  const childrenRef = useRef(null);
  const pullDownRef = useRef(null);
  let pullToRefreshThresholdBreached = false;
  let isDragging = false;
  let startY = 0;
  let currentY = 0;
  let pullDownThreshold = 45;
  let maxPullDownDistance = 95;

  useEffect(() => {
    if (!childrenRef || !childrenRef.current) return;
    childrenRef.current.addEventListener('touchstart', onTouchStart, { passive: true });
    childrenRef.current.addEventListener('mousedown', onTouchStart);
    childrenRef.current.addEventListener('touchmove', onTouchMove, { passive: false });
    childrenRef.current.addEventListener('mousemove', onTouchMove);
    childrenRef.current.addEventListener('touchend', onEnd);
    childrenRef.current.addEventListener('mouseup', onEnd);
    document.body.addEventListener('mouseleave', onEnd);

    return () => {
      if (!childrenRef || !childrenRef.current) return;
      childrenRef.current.removeEventListener('touchstart', onTouchStart);
      childrenRef.current.removeEventListener('mousedown', onTouchStart);
      childrenRef.current.removeEventListener('touchmove', onTouchMove);
      childrenRef.current.removeEventListener('mousemove', onTouchMove);
      childrenRef.current.removeEventListener('touchend', onEnd);
      childrenRef.current.removeEventListener('mouseup', onEnd);
      document.body.removeEventListener('mouseleave', onEnd);
    };
  }, []);

  const initContainer = () => {
    requestAnimationFrame(() => {
      if (childrenRef && childrenRef.current) {
        childrenRef.current.style.overflowX = 'hidden';
        childrenRef.current.style.overflowY = 'auto';
        childrenRef.current.style.transform = `translate(0px, 0px)`;
      }
      if (pullDownRef && pullDownRef.current) {
        pullDownRef.current.style.opacity = '0';
      }
      if (containerRef.current) {
        containerRef.current.classList.remove('ptr--pull-down-treshold-breached');
        containerRef.current.classList.remove('ptr--dragging');
        containerRef.current.classList.remove('ptr--fetch-more-treshold-breached');
      }

      if (pullToRefreshThresholdBreached) pullToRefreshThresholdBreached = false;
    });
  };

  const onTouchStart = (e) => {
    isDragging = false;
    if (e instanceof MouseEvent) {
      startY = e.pageY;
    }
    if (window.TouchEvent && e instanceof TouchEvent) {
      startY = e.touches[0].pageY;
    }
    currentY = startY;
    // Check if element can be scrolled
    if (e.type === 'touchstart' && isTreeScrollable(e.target, -0b01)) {
      return;
    }
    // Top non visible so cancel
    if (childrenRef.current.getBoundingClientRect().top < 0) {
      return;
    }
    isDragging = true;
  };

  const onTouchMove = (e) => {
    if (!isDragging) {
      return;
    }

    if (window.TouchEvent && e instanceof TouchEvent) {
      currentY = e.touches[0].pageY;
    } else {
      currentY = e.pageY;
    }

    containerRef.current.classList.add('ptr--dragging');

    if (currentY < startY) {
      isDragging = false;
      return;
    }

    // Limit to trigger refresh has been breached
    if (currentY - startY >= pullDownThreshold) {
      isDragging = true;
      pullToRefreshThresholdBreached = true;
      containerRef.current.classList.remove('ptr--dragging');
      containerRef.current.classList.add('ptr--pull-down-treshold-breached');
    }

    // maxPullDownDistance breached, stop the animation
    if (currentY - startY > maxPullDownDistance) {
      return;
    }
    pullDownRef.current.style.opacity = ((currentY - startY) / 65).toString();
    childrenRef.current.style.overflow = 'visible';
    childrenRef.current.style.transform = `translate(0px, ${currentY - startY}px)`;
    pullDownRef.current.style.visibility = 'visible';
  };

  const onEnd = () => {
    isDragging = false;
    startY = 0;
    currentY = 0;

    // Container has not been dragged enough, put it back to it's initial state
    if (!pullToRefreshThresholdBreached) {
      if (pullDownRef.current) pullDownRef.current.style.visibility = 'hidden';
      initContainer();
      return;
    }

    if (childrenRef.current) {
      childrenRef.current.style.overflow = 'visible';
      childrenRef.current.style.transform = `translate(0px, ${pullDownThreshold}px)`;
    }
    props.onRefresh().then(initContainer());
  };


    return (
      <div ref={containerRef}>

        <div className="ptr__pull-down" ref={pullDownRef}>
        <div className="ptr__loader ptr__pull-down--loading">Release to refresh</div>
        <div className="ptr__pull-down--pull-more">Pull Down To Refresh</div>
        </div>
          <div className="ptr__children" ref={childrenRef}>
            {props.children}
          </div>
      </div>
    );
}
