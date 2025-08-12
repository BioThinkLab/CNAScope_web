import { Input } from 'antd'
import { useState } from "react"

export const SelectedGenesSearchBar = ({ handleSearchTextChange }) => {
    const [searchText, setSearchText] = useState('')

    const onSearch = () => {
        handleSearchTextChange?.(searchText)
    }

    const onClear = () => {
        handleSearchTextChange?.('')
    }

    return (
        <Input.Search
            placeholder="Search..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={onSearch}
            onClear={onClear}
            style={{
                width: 200,
            }}
        />
    )
}
