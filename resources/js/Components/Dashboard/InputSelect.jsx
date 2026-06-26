import React, { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { IconChevronDown, IconCircle, IconCircleFilled } from '@tabler/icons-react'

export default function InputSelect({ selected, data, setSelected, label, errors, placeholder, multiple = false, searchable = false, displayKey = 'name' }) {
    const [search, setSearch] = useState('')

    const filteredData = data.filter(item =>
        item[displayKey]?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='flex flex-col gap-2'>
            <label className='text-[#6f4b36] dark:text-[#e7c9aa] text-sm'>{label}</label>
            <Listbox value={selected} onChange={setSelected} multiple={multiple} by="id">
                <Listbox.Button className={'w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 flex justify-between items-center gap-8 bg-white text-[#6f4b36] focus:border-[#c8ab8f] border-[#e2d1c0] dark:bg-slate-900 dark:text-[#f1e0cf] dark:focus:border-[#8a5a3c] dark:border-slate-800'}>
                    {multiple ? (
                        selected.length > 0 ? selected.map(item => item[displayKey]).join(', ') : placeholder
                    ) : (
                        selected ? selected[displayKey] : placeholder
                    )}
                    <IconChevronDown size={20} strokeWidth={1.5} />
                </Listbox.Button>
                <Listbox.Options className={'p-4 border rounded-lg flex flex-col gap-2 bg-[#fffaf3] border-[#e2d1c0] dark:border-slate-800 dark:bg-slate-950'}>
                    {searchable && (
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari..."
                            className="w-full px-3 py-1.5 mb-2 text-sm border rounded-md bg-white text-[#6f4b36] border-[#e2d1c0] focus:outline-none focus:border-[#c8ab8f] dark:bg-slate-900 dark:text-[#f1e0cf] dark:border-slate-800 dark:focus:border-[#8a5a3c]"
                        />
                    )}
                    {filteredData.map((item) => (
                        <Listbox.Option key={item.id} value={item}>
                            {({ selected }) => (
                                <div
                                    className='text-sm cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-2 bg-white text-[#6f4b36] hover:bg-[#f5ebdf] border border-[#e2d1c0] dark:bg-slate-900 dark:border-slate-800 dark:text-[#e7c9aa] dark:hover:bg-slate-800'>
                                    {selected ? <IconCircleFilled size={15} strokeWidth={1.5} className='text-[#8a5a3c]' /> : <IconCircle size={15} strokeWidth={1.5} />}
                                    {item[displayKey]}
                                </div>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
            {errors && (
                <small className='text-xs text-[#9b5c43]'>{errors}</small>
            )}
        </div>
    )
}
