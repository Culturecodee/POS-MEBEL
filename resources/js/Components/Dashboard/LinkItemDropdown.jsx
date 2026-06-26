import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    IconChevronDown,
    IconChevronUp,
    IconCornerDownRight,
} from "@tabler/icons-react";
export default function LinkItemDropdown({ icon, title, data, access, sidebarOpen, ...props }) {

    // destruct url from usepage
    const { url } = usePage();

    // define state
    const [isOpen, setIsOpen] = useState(false);

    // destruct auth from usepage props
    const { auth } = usePage().props;

    return (
        <>
            {
                auth.super === true ?
                    sidebarOpen ?
                        <>
                            <button
                                className="min-w-full flex items-center justify-between gap-x-3.5 px-4 py-3 text-sm font-medium capitalize text-[#7e6653] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100"
                                onClick={() => setIsOpen(!isOpen)}>
                                <div className='flex items-center gap-x-3.5'>{icon}{title}</div>
                                {isOpen ? (
                                    <IconChevronUp size={18} strokeWidth={1.5} />
                                ) : (
                                    <IconChevronDown size={18} strokeWidth={1.5} />
                                )}
                            </button>
                            {isOpen &&
                                data.map((data, i) => (
                                    data.permissions === true &&
                                    <Link
                                        key={i}
                                        href={data.href}
                                        className={`${url === data.href && 'border-r-2 border-r-[#a8835c] bg-[#f3eadf] text-[#6f4b36] dark:border-r-gray-500 dark:bg-gray-900 dark:text-white'} min-w-full flex items-center gap-x-3.5 px-5 py-3 text-sm font-medium capitalize line-clamp-1 text-[#8f735e] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100`}
                                        {...props}>
                                        <IconCornerDownRight size={18} strokeWidth={1.5} /> {data.title}
                                    </Link>
                                ))
                            }
                        </>
                        :
                        <>
                            <button
                                className='min-w-full flex justify-center py-3 text-[#8f735e] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100'
                                onClick={() => setIsOpen(!isOpen)}>
                                {!isOpen ? icon : <IconChevronDown size={20} strokeWidth={1.5} />}
                            </button>
                            {isOpen &&
                                data.map((data, i) => (
                                    data.permissions === true &&
                                    <Link
                                        href={data.href}
                                        className={`${url === data.href && 'border-r-2 border-r-[#a8835c] bg-[#f3eadf] text-[#6f4b36] dark:border-r-gray-500 dark:bg-gray-900 dark:text-white'} min-w-full flex justify-center py-3 text-[#8f735e] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100`}
                                        key={i}
                                        {...props}>
                                        {data.icon}
                                    </Link>
                                ))
                            }
                        </>
                    :
                    access === true &&
                        sidebarOpen ?
                        <>
                            <button
                                className="min-w-full flex items-center justify-between gap-x-3.5 px-4 py-3 text-sm font-medium capitalize text-[#7e6653] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100"
                                onClick={() => setIsOpen(!isOpen)}>
                                <div className='flex items-center gap-x-3.5'>{icon}{title}</div>
                                {isOpen ? (
                                    <IconChevronUp size={18} strokeWidth={1.5} />
                                ) : (
                                    <IconChevronDown size={18} strokeWidth={1.5} />
                                )}
                            </button>
                            {isOpen &&
                                data.map((data, i) => (
                                    data.permissions === true &&
                                    <Link
                                        key={i}
                                        href={data.href}
                                        className={`${url === data.href && 'border-r-2 border-r-[#a8835c] bg-[#f3eadf] text-[#6f4b36] dark:border-r-gray-500 dark:bg-gray-900 dark:text-white'} min-w-full flex items-center gap-x-3.5 px-5 py-3 text-sm font-medium capitalize line-clamp-1 text-[#8f735e] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100`}
                                        {...props}>
                                        <IconCornerDownRight size={18} strokeWidth={1.5} /> {data.title}
                                    </Link>
                                ))
                            }
                        </>
                        :
                        <>
                            <button
                                className='min-w-full flex justify-center py-3 text-[#8f735e] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100'
                                onClick={() => setIsOpen(!isOpen)}>
                                {!isOpen ? icon : <IconChevronDown size={20} strokeWidth={1.5} />}
                            </button>
                            {isOpen &&
                                data.map((data, i) => (
                                    data.permissions === true &&
                                    <Link
                                        href={data.href}
                                        className={`${url === data.href && 'border-r-2 border-r-[#a8835c] bg-[#f3eadf] text-[#6f4b36] dark:border-r-gray-500 dark:bg-gray-900 dark:text-white'} min-w-full flex justify-center py-3 text-[#8f735e] transition-all hover:cursor-pointer hover:border-r-2 hover:border-r-[#a8835c] hover:bg-[#f7efe6] hover:text-[#5c4131] dark:text-gray-500 dark:hover:border-r-gray-50 dark:hover:text-gray-100`}
                                        key={i}
                                        {...props}>
                                        {data.icon}
                                    </Link>
                                ))
                            }
                        </>
            }
        </>
    )
}
