import { useDatasetList } from "@/components/features/database/hooks/useDatasetList"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { useMemo, useState } from "react"
import FilterCollapse from "@/components/features/database/components/datasetTable/FilterCollapse"
import DatasetTable from "@/components/features/database/components/datasetTable/DatasetTable"
import { Stack } from "@mui/system"
import DatasetsTableOperations from "@/components/features/database/components/datasetTable/DatasetsTableOperations"
import Fuse from "fuse.js"

const MULTI_VALUE_FIELDS = new Set(['protocol', 'workflow'])
const FUSE_KEYS = [
    'name',
    'full_name',
    'link',
    'source',
    'programme',
    'modality',
    'obs_type',
    'protocol',
    'platform',
    'workflow',
    'cn_type',
    'reference',
    'cancer_type',
    'cancer_type_full_name'
]

const FUSE_OPTIONS = {
    keys: FUSE_KEYS,
    isCaseSensitive: false,
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
}

const DatabaseMainViewWrapper = ({}) => {
    const { datasets, isLoading, isError } = useDatasetList()

    if (isLoading) return <LoadingView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    if (isError) return <ErrorView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    return (
        <DatabaseTableContent datasets={datasets}/>
    )
}

const DatabaseTableContent = ({ datasets }) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [filters, setFilters] = useState({})
    const [searchText, setSearchTest] = useState('')

    const availableFilters = useMemo(() => {
        return buildFilters(datasets)
    }, [datasets])

    const filteredData = useMemo(() => {
        let result = datasets

        for (const key in filters) {
            const fv = filters[key]
            const selected = Array.isArray(fv) ? fv : (fv ? [fv] : [])
            if (selected.length === 0) continue

            const wanted = toKeyedSet(selected)

            if (MULTI_VALUE_FIELDS.has(key)) {
                result = result.filter(d => {
                    const raw = d[key]
                    const tokens = tokenize(raw)

                    const hitTokens = tokens.some(t => wanted.has(t))
                    const hitEmpty = wanted.has('') && tokens.length === 0

                    return hitTokens || hitEmpty
                })
            } else {
                result = result.filter(d => {
                    const raw = d[key]

                    if (wanted.has('') && isBlank(raw)) return true
                    if (isBlank(raw)) return false

                    return wanted.has(String(raw).trim())
                })
            }
        }

        return result
    }, [datasets, filters])

    const searchedData = useMemo(() => {
        const q = searchText.trim()
        if (!q) return filteredData

        const subFuse = new Fuse(filteredData, FUSE_OPTIONS)
        return subFuse.search(q).map(r => r.item)
    }, [filteredData, searchText])

    const clearFilters = () => {
        setFilters({})
    }

    const handleIsShowLeftChange = () => {
        setIsShowLeft(!isShowLeft)
    }

    const handleSearchTextChange = (newSearchText) => {
        setSearchTest(newSearchText)
    }

    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanel={
                <FilterCollapse
                    filters={filters}
                    setFilters={setFilters}
                    availableFilters={availableFilters}
                    clearFilters={clearFilters}
                />
            }
            rightPanel={
                <Stack spacing={3} sx={{ pt: '8px' }}>
                    <DatasetsTableOperations
                        datasetsNum={searchedData.length}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                        handleSearchTextChange={handleSearchTextChange}
                    />
                    <DatasetTable
                        data={searchedData}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                    />
                </Stack>
            }
        />
    )
}

const buildFilters = (datasets) => {
    if (!datasets) return {}

    const getSortedUnique = (arr) => [...new Set(arr)].sort((a, b) => a.localeCompare(b))

    return {
        source: getSortedUnique(datasets.map(d => d.source)),
        programme: getSortedUnique(datasets.map(d => d.programme)),
        modality: getSortedUnique(datasets.map(d => d.modality)),
        obs_type: getSortedUnique(datasets.map(d => d.obs_type)),
        protocol: getUniqueValues(datasets, 'protocol'),
        platform: getSortedUnique(datasets.map(d => d.platform)),
        workflow: getUniqueValues(datasets, 'workflow'),
        cn_type: getSortedUnique(datasets.map(d => d.cn_type)),
        reference: getSortedUnique(datasets.map(d => d.reference)),
        cancer_type: getSortedUnique(datasets.map(d => d.cancer_type)),
    }
}

const getUniqueValues = (datasets, key) => {
    const values = datasets.flatMap(d => {
        const raw = d[key]
        const tokens = tokenize(raw)

        return tokens.length > 0 ? tokens : ['']
    })

    return [...new Set(values)].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    )
}

const tokenize = (raw) => {
    if (!raw) return []
    return String(raw)
        .split(/[,/]/)
        .map(v => v.trim())
        .filter(Boolean)
}

const toKeyedSet = (arr) => new Set(arr.map(v => String(v).trim()))

const isBlank = (raw) => raw == null || String(raw).trim() === ''

export default DatabaseMainViewWrapper
