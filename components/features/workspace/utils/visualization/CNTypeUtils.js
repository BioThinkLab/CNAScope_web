export const transformTaskCNType = (task) => {
    const valueType = task.data['value_type']
    const windowType = task.data['window_type']

    if (valueType === 'int' && windowType === 'bin') {
        return 'Bin Integer'
    } else if (valueType === 'int' && windowType === 'gene') {
        return 'Gene Integer'
    } else if (valueType === 'log' && windowType === 'bin') {
        return 'Bin Log'
    } else if (valueType === 'log' && windowType === 'gene') {
        return 'Gene Log'
    }
}
