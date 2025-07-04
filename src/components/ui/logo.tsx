import { type SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.1,14.5c0,0-1.2-5.1-4.1-8.3c-2.9-3.2-7-4.4-7-4.4S5.5,2.1,3.3,4.9c-2.2,2.8-2.5,6.6-2.5,6.6s1.3-3.7,3.9-3.9C7.3,7.4,11,9.8,11,9.8s-4.8,1.9-6.6,5.1c-1.8,3.2-0.4,7.1,0.2,8.4c-3.1-0.2-6.4-1.2-6.4-1.2s-1.8,8.2,7.9,12.2c9.7,4,16.2-1.9,16.2-1.9s-7.1,3.4-11.8-0.9C5.6,26.9,8.5,22.2,8.5,22.2s6.8,8.4,13.5,3.3C28.7,20.4,21.1,14.5,21.1,14.5z"
        className="fill-current text-rose-base"
      />
      <text
        x="38"
        y="27"
        fontFamily="Poppins, sans-serif"
        fontSize="24"
        fontWeight="600"
        className="fill-current text-wine-base"
      >
        Flor de Sal
      </text>
    </svg>
  );
}