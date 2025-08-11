import Fuse from "fuse.js"
import { Input } from 'antd'
import { useState } from "react"

export const SelectedGenesSearchBar = ({ selectedGenes, setSelectedGenes }) => {
    const [searchText, setSearchText] = useState('')

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value)
    }

    const onSearch = () => {
        if (searchText === '') {
            setSelectedGenes(selectedGenes)
        } else {
            const fuseOptions = {
                threshold: 0.2,
                keys: [
                    'gene'
                ]
            }
            const fuse = new Fuse(selectedGenes, fuseOptions)
            const searchedGeneIndexArray = fuse.search(searchText).map(record => record.refIndex)
            setSelectedGenes(selectedGenes.filter((_, index) => searchedGeneIndexArray.includes(index)))
        }
    }

    return (
        <Input.Search
            placeholder="Search..."
            allowClear
            value={searchText}
            onChange={handleSearchTextChange}
            onSearch={(value) => onSearch(value)}
            style={{
                width: 200,
            }}
        />
    )
}
