export const capitalizeFirstLetter = (str) => {
    // 检查输入是否为有效的字符串
    if (str && str.length > 0) {
        // 将首字母大写，其余部分保持原样
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str; // 如果输入为空或无效，返回原字符串
}
