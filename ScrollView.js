import React, {useEffect, useRef} from 'react';

const ScrollView = ({ dependants, className, style, children }) => {

    const contentRef = useRef(null);

    useEffect(() => {
        const container = contentRef.current;
        if (!container) return; // Exit if ref is not yet attached

        let isDown = false;
        let startX;
        let startY;
        let scrollLeft;
        let scrollTop;

        const handleMouseDown = (e) => {
            isDown = true;
            // Use the cursor style from your CSS for visual feedback
            container.style.cursor = 'grabbing';
            container.classList.add('active'); // Optional: Add a CSS class for active state

            startX = e.pageX - container.offsetLeft;
            startY = e.pageY - container.offsetTop;
            scrollLeft = container.scrollLeft;
            scrollTop = container.scrollTop;
        };

        const handleMouseLeave = () => {
            isDown = false;
            container.style.cursor = 'grab';
            container.classList.remove('active');
        };

        const handleMouseUp = () => {
            isDown = false;
            container.style.cursor = 'grab';
            container.classList.remove('active');
        };

        const handleMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();

            // Calculate current mouse position relative to the container
            const x = e.pageX - container.offsetLeft;
            const y = e.pageY - container.offsetTop;

            // Calculate the distance moved ("walk")
            const walkX = (x - startX) * 1;
            const walkY = (y - startY) * 1;

            // Apply the scroll
            container.scrollLeft = scrollLeft - walkX;
            container.scrollTop = scrollTop - walkY;
        };

        // Attach event listeners
        container.addEventListener('mousedown', handleMouseDown);
        // Attach move/up listeners to the document for a better drag experience
        // (allows dragging to continue even if the mouse leaves the container)
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        // Add a listener to reset state if mouse leaves the container area
        container.addEventListener('mouseleave', handleMouseLeave);


        // Cleanup function: remove event listeners when component unmounts
        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };

    }, dependants); // Rerun this effect whenever the loadedSettings prop changes

    return (
        <div className={className} ref={contentRef} style={{...style, overflow: "auto"}}>
            {children}
        </div>
    )
}

export default ScrollView;