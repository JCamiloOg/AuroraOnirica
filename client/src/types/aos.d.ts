import 'react';

declare module "aos" {
    interface AosOptions {
        offset?: number;
        delay?: number;
        duration?: number;
        easing?: string;
        once?: boolean;
        mirror?: boolean;
        anchorPlacement?: string;
        startEvent?: string;
        disable?: boolean | 'phone' | 'tablet' | 'mobile';
    }

    interface Aos {
        init(options?: AosOptions): void;
        refresh(): void;
        refreshHard(): void;
    }

    const AOS: Aos;
    export default AOS;
}


declare module 'react' {
    interface HTMLAttributes {
        'data-aos'?:
        | 'fade'
        | 'fade-up'
        | 'fade-down'
        | 'fade-left'
        | 'fade-right'
        | 'fade-up-right'
        | 'fade-up-left'
        | 'fade-down-right'
        | 'fade-down-left'
        | 'flip-up'
        | 'flip-down'
        | 'flip-left'
        | 'flip-right'
        | 'slide-up'
        | 'slide-down'
        | 'slide-left'
        | 'slide-right'
        | 'zoom-in'
        | 'zoom-in-up'
        | 'zoom-in-down'
        | 'zoom-in-left'
        | 'zoom-in-right'
        | 'zoom-out'
        | 'zoom-out-up'
        | 'zoom-out-down'
        | 'zoom-out-left'
        | 'zoom-out-right';

        'data-aos-delay'?: number;
        'data-aos-duration'?: number;
        'data-aos-offset'?: number;
        'data-aos-easing'?: string;
        'data-aos-anchor'?: string;
        'data-aos-anchor-placement'?: string;
        'data-aos-once'?: boolean;
    }
}

