// Mock Inertia Link for static deployment
import React from 'react';

interface LinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

export const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
    return (
        <a href={href} {...props}>
            {children}
        </a>
    );
};