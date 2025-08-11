import { useState } from "react"
import { Input } from 'antd'

const DatasetsSearchBar = ({ onSearch, defaultValue = '', placeholder = 'Search datasets…' }) => {
    const [searchText, setSearchText] = useState(defaultValue)

    const handleSearch = () => {
        onSearch?.(searchText.trim())
    }

    const handleClear = () => {
        onSearch?.('')
    }

    return (
        <Input.Search
            allowClear
            value={searchText}
            placeholder={placeholder}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClear}
            style={{ width: 280 }}
        />
    )
}

export default DatasetsSearchBar
