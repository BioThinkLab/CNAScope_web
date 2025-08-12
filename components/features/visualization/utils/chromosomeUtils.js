export const hg38ChromosomeLength = {
    chr1: 248956422,
    chr2: 242193529,
    chr3: 198295559,
    chr4: 190214555,
    chr5: 181538259,
    chr6: 170805979,
    chr7: 159345973,
    chr8: 145138636,
    chr9: 138394717,
    chr10: 133797422,
    chr11: 135086622,
    chr12: 133275309,
    chr13: 114364328,
    chr14: 107043718,
    chr15: 101991189,
    chr16: 90338345,
    chr17: 83257441,
    chr18: 80373285,
    chr19: 58617616,
    chr20: 64444167,
    chr21: 46709983,
    chr22: 50818468,
    chrX: 156040895,
    chrY: 57227415
}

export const hg38ChromosomeStartPositions = {
    chr1: 0,
    chr2: 248956422,
    chr3: 491149951,
    chr4: 689445510,
    chr5: 879660065,
    chr6: 1061198324,
    chr7: 1232004303,
    chr8: 1391350276,
    chr9: 1536488912,
    chr10: 1674883629,
    chr11: 1808681051,
    chr12: 1943767673,
    chr13: 2077042982,
    chr14: 2191407310,
    chr15: 2298451028,
    chr16: 2400442217,
    chr17: 2490780562,
    chr18: 2574038003,
    chr19: 2654411288,
    chr20: 2713028904,
    chr21: 2777473071,
    chr22: 2824183054,
    chrX: 2875001522,
    chrY: 3031042417
}

export const hg38ChromosomeTicks = {
    '248956422': "chr1",
    '491149951': "chr2",
    '689445510': "chr3",
    '879660065': "chr4",
    '1061198324': "chr5",
    '1232004303': "chr6",
    '1391350276': "chr7",
    '1536488912': "chr8",
    '1674883629': "chr9",
    '1808681051': "chr10",
    '1943767673': "chr11",
    '2077042982': "chr12",
    '2191407310': "chr13",
    '2298451028': "chr14",
    '2400442217': "chr15",
    '2490780562': "chr16",
    '2574038003': "chr17",
    '2654411288': "chr18",
    '2713028904': "chr19",
    '2777473071': "chr20",
    '2824183054': "chr21",
    '2875001522': "chr22",
    '3031042417': "chrX",
    '3088269832': "chrY"
}

export const hg38ChromosomeXDomain = [1, 3088269832]

export const hg19ChromosomeLength = {
    chr1: 249250621,
    chr2: 243199373,
    chr3: 198022430,
    chr4: 191154276,
    chr5: 180915260,
    chr6: 171115067,
    chr7: 159138663,
    chr8: 146364022,
    chr9: 141213431,
    chr10: 135534747,
    chr11: 135006516,
    chr12: 133851895,
    chr13: 115169878,
    chr14: 107349540,
    chr15: 102531392,
    chr16: 90354753,
    chr17: 81195210,
    chr18: 78077248,
    chr19: 59128983,
    chr20: 63025520,
    chr21: 48129895,
    chr22: 51304566,
    chrX: 155270560,
    chrY: 59373566
}

export const hg19ChromosomeStartPositions = {
    chr1: 0,
    chr2: 249250621,
    chr3: 492449994,
    chr4: 690472424,
    chr5: 881626700,
    chr6: 1062541960,
    chr7: 1233657027,
    chr8: 1392795690,
    chr9: 1539159712,
    chr10: 1680373143,
    chr11: 1815907890,
    chr12: 1950914406,
    chr13: 2084766301,
    chr14: 2199936179,
    chr15: 2307285719,
    chr16: 2409817111,
    chr17: 2500171864,
    chr18: 2581367074,
    chr19: 2659444322,
    chr20: 2718573305,
    chr21: 2781598825,
    chr22: 2829728720,
    chrX: 2881033286,
    chrY: 3036303846
}

export const hg19ChromosomeTicks = {
    '249250621': "chr1",
    '492449994': "chr2",
    '690472424': "chr3",
    '881626700': "chr4",
    '1062541960': "chr5",
    '1233657027': "chr6",
    '1392795690': "chr7",
    '1539159712': "chr8",
    '1680373143': "chr9",
    '1815907890': "chr10",
    '1950914406': "chr11",
    '2084766301': "chr12",
    '2199936179': "chr13",
    '2307285719': "chr14",
    '2409817111': "chr15",
    '2500171864': "chr16",
    '2581367074': "chr17",
    '2659444322': "chr18",
    '2718573305': "chr19",
    '2781598825': "chr20",
    '2829728720': "chr21",
    '2881033286': "chr22",
    '3036303846': "chrX",
    '3095677412': "chrY"
}

export const hg19ChromosomeXDomain = [1, 3095677412]

export const calculateChromosomeBinCount = (binStep, version = 'hg38') => {
    const chromosomeLengthData = version === 'hg19' ? hg19ChromosomeLength : hg38ChromosomeLength

    let chromosomeBinCntDict = []

    for (let [chromosome, length] of Object.entries(chromosomeLengthData)) {
        const binCount = Math.floor(length / binStep) + 1
        chromosomeBinCntDict.push([chromosome, binCount])
    }

    return chromosomeBinCntDict
}
