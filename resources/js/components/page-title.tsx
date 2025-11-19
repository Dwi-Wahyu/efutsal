import { ReactNode } from 'react';

export function PageTitle({ children }: { children: ReactNode }) {
    return <h1 className="text-lg font-bold">{children}</h1>;
}
