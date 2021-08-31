import {cubicOut, cubicInOut} from 'svelte/easing'

export function slide(
    node,
    {
        horizon = 0,
        delay = 0,
        duration = 400,
        easing = cubicInOut
    }
) {
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    const borderTopWidth = parseFloat(style.borderTopWidth);
    const borderBottomWidth = parseFloat(style.borderBottomWidth);

    const width = parseFloat(style.width);
    const paddingLeft = parseFloat(style.paddingLeft);
    const paddingRight = parseFloat(style.paddingRight);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);
    const borderLeftWidth = parseFloat(style.borderLeftWidth);
    const borderRightWidth = parseFloat(style.borderRightWidth);

     let base =  `overflow: hidden;`
    if(/input|textare/i.test(node.tagName)){
        base+='color:transparent;'
    }
    return {
        delay,
        duration,
        easing,
        css: t => base+
            `opacity: ${Math.min(t * 20, 1) * opacity};` +
            (horizon ?
                    `width: ${t * width}px;` +
                    `padding-left: ${t * paddingLeft}px;` +
                    `padding-right: ${t * paddingRight}px;` +
                    `margin-left: ${t * marginLeft}px;` +
                    `margin-right: ${t * marginRight}px;` +
                    `border-left-width: ${t * borderLeftWidth}px;` +
                    `border-right-width: ${t * borderRightWidth}px;`
                    :
                    `height: ${t * height}px;` +
                    `padding-top: ${t * paddingTop}px;` +
                    `padding-bottom: ${t * paddingBottom}px;` +
                    `margin-top: ${t * marginTop}px;` +
                    `margin-bottom: ${t * marginBottom}px;` +
                    `border-top-width: ${t * borderTopWidth}px;` +
                    `border-bottom-width: ${t * borderBottomWidth}px;`
            )
    };
}