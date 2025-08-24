import { Box, Grid } from "@mui/system"
import { Button, Modal, Steps, Typography, Image } from "antd"
import { useCallback, useEffect, useState } from "react"
import { useDetailPageTutorialStore } from "@/stores/DetailPageTutorialStore"

const { Title, Paragraph } = Typography

const OverviewDatasetInfoContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Dataset Information Panel</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            You will find information such as the <strong>dataset
            name</strong>, <strong>source</strong>, <strong>modality</strong>, <strong>observation
            type</strong>, <strong>workflow</strong>, <strong>protocol</strong>, etc. This provides a comprehensive
            overview of essential metadata and dataset statistics, enabling users to quickly understand the scope and
            contents of the dataset.
        </Paragraph>
        <Image src='/tutorial/DatasetOverview.png' alt='DatasetOverview.png'/>
    </>
)

const SampleListInfoContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Sample List Panel</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            The Samples List section on CNAScope provides a detailed tabular overview of individual samples within a
            dataset, such as the TCGA-ACC cohort, showcasing key clinical and demographic data. Columns include <strong>Sample
            ID</strong> (e.g., TCGA-OR-ABLL), <strong>Disease Type</strong> (e.g., Adenomas and
            Adenocarcinoma), <strong>Primary Site</strong> (e.g., adrenal gland), <strong>Tumor
            Stage</strong> and <strong>Tumor Grade</strong> (often not reported), <strong>Ethnicity</strong>(e.g.,
            Hispanic or Latino, or not reported), <strong>Race</strong> (e.g., White), <strong>Gender</strong> (e.g.,
            male or female), <strong>Age</strong>(e.g., 75 years), <strong>PFS</strong>(progression-free survival, often
            not reported), <strong>Days to Death</strong> (e.g., 1613 days), <strong>PFS Status</strong> (e.g., 0),
            and<strong>Vital Status</strong>(e.g., 1 for deceased). The list supports pagination (10 samples per page)
            with navigation controls, allowing users to filter and explore the 92 samples in this dataset, facilitating
            in-depth analysis of patient-specific CNA profiles and clinical outcomes.
        </Paragraph>
        <Image src='/tutorial/SampleListPanel.gif' alt='SampleListPanel.gif'/>
    </>
)

const WorkflowSelectorContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Select Workflow</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            The <strong>Workflow Selector</strong> lets you choose a workflow from the available options. Once a
            workflow is selected, you can view detailed visualizations specific to that workflow.
        </Paragraph>
        <Image src='/tutorial/WorkflowSelector.png' alt='WorkflowSelector.png'/>
    </>
)

const BinLevelCNAHeatmapContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Bin-Level CNA Heatmap</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            <strong>
                A CNA heatmap with samples as rows and chromosome-level genomic regions as columns, equied with zoomable
                cut-dendrogram and case meta annotation
            </strong>
        </Paragraph>
        <Paragraph style={{ fontSize: '20px' }}>
            Over the past two decades, CNA heatmap has often been adopted to visualize the CNA profiles of a batch of
            samples in various sequencing protocols. e.g. bulk SNP array, whole genome/exon sequencing. CNA heatmap aids
            the landscape view of single case copy number in several pieces of literature. It is essential to reduce the
            size of heatmap while retaining the heterogeneity among cases. Cluster zoom-in operation is achieved by
            clicking the node in the dendrogram.
        </Paragraph>
        <Paragraph style={{ fontSize: '20px' }}>
            Here, we build viz interface &apos;&apos;CNA Heatmap&apos;&apos; for interactive and real-time visualization
            of CNA landscape of a cancer project with zoomable dendrogram. With cases as rows and chromosome-level
            genomic regions as columns, the CNA heatmap exhibits the copy number of a specific case across the entire
            genome. The clinical meta heatmap is displayed on the left. A zoomable cut dendrogram is displayed on the
            left. If the mouse hovers over case CNA/meta heatmap, cutted dendrogram, and stairstep, an interactive
            tooltip carried its vital information will appear.
        </Paragraph>
        <Image src='/tutorial/BinLevelCNAHeatmap.gif' alt='BinLevelCNAHeatmap.gif'/>
    </>
)

const GeneLevelCNAHeatmapContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Gene-Level CNA Heatmap</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            To generate a gene-level heatmap in CNAScope, begin by clicking the Select button to choose the gene(s) of
            interest from the available options, such as those listed in the gene selection interface (e.g., genes
            associated with the TCGA-ACC dataset). Once the desired genes are selected, click the Render button to
            process the data and visualize the results. This action triggers the rendering of a gene-level heatmap,
            displaying the copy number aberration (CNA) profiles across samples or cells, with rows representing
            observations and columns corresponding to the selected genes. The heatmap, enhanced with color gradients and
            interactive features, allows users to explore CNA patterns and heterogeneity effectively, as illustrated in
            the visualization panels.
        </Paragraph>
        <Image src='/tutorial/GeneLevelCNAHeatmap.gif' alt='GeneLevelCNAHeatmap.gif'/>
    </>
)

const TermLevelCNAHeatmapContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Term-Level CNA Heatmap</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            To create a term-level heatmap in CNAScope, start by clicking the Select button to choose the terms of
            interest, such as pathways or functional annotations (e.g., from MSigDB or KEGG) relevant to the dataset
            like TCGA-ACC, mirroring the gene selection process. After selecting the desired terms, click the Render
            button to generate the heatmap, which visualizes copy number aberration (CNA) profiles across samples or
            cells, with rows representing observations and columns corresponding to the selected terms, offering
            insights into pathway-level genomic alterations similar to the gene-level view.
        </Paragraph>
        <Image src='/tutorial/TermLevelCNAHeatmap.gif' alt='TermLevelCNAHeatmap.gif'/>
    </>
)

const CNAPhylogeneticTreeContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>CNA Phylogenetic Tree</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            The CNA Phylogenetic Tree in CNAScope visually represents the evolutionary relationships among samples or
            cells within a dataset, such as TCGA-ACC, based on their copy number aberration (CNA) profiles. Rendered
            with a branching structure, the tree displays nodes corresponding to individual observations (e.g., samples
            or cells) and branches indicating their phylogenetic divergence, with branch lengths reflecting the degree
            of CNA differences.
        </Paragraph>
        <Image src='/tutorial/CNAPhylogeneticTree.png' alt='CNAPhylogeneticTree.png'/>
    </>
)

const CNAEmbeddingMapContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>CNA Embedding Map</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            The CNA Embedding Map in CNAScope offers a powerful visualization of cancer copy number aberration (CNA)
            profiles, leveraging dimensionality reduction techniques such as UMAP, TSNE, and PCA to project the
            high-dimensional CNA data from datasets like TCGA-ACC into a two-dimensional space.
        </Paragraph>
        <Image src='/tutorial/CNAEmbeddingMap.png' alt='CNAEmbeddingMap.png'/>
    </>
)

const CNAPloidyStairstep = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>CNA Ploidy Stairstep</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            The CNA ploidy distribution can intuitively show tumor heterogeneity. The ploidy line plot along the
            chromosomes can also visually show the heterogeneity between tumor sample groups by combining genomic
            coordinates. By collapsing the cases in the same tumor sample groups into one observation, we can infer the
            pseudo-bulk ploidy of each sample group. Since cancer CNA ploidy line alters along chromosomes, we call it
            the &quot;stairstep plot&quot;.
        </Paragraph>
        <Image src='/tutorial/CNAPloidyStairstep.gif' alt='CNAPloidyStairstep.gif'/>
    </>
)

const CNAPloidyDistribution = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>CNA Ploidy Distribution</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            The CNA Ploidy Distribution visualization in CNAScope provides a detailed representation of the ploidy
            levels (total DNA content) across samples or cells within a dataset, such as TCGA-ACC, reflecting the
            genomic instability characteristic of cancer.
        </Paragraph>
        <Image src='/tutorial/CNAPloidyDistribution.png' alt='CNAPloidyDistribution.png'/>
    </>
)

const CNAFocalCNAContent = ({}) => (
    <>
        <Title level={4} style={{ margin: 0, marginBottom: '8px', fontSize: '32px' }}>Focal CNA & Gene</Title>
        <Paragraph style={{ fontSize: '20px' }}>
            &quot;Focal CNA & Gene&quot; displays the GISTIC G-score stairsteps of all samples. The red regions indicate
            significant amplification, while the blue regions represent significant deletion.
        </Paragraph>
        <Image src='/tutorial/CNAFocal.gif' alt='CNAFocal.gif'/>
    </>
)

const tutorialSteps = [
    {
        title: 'Step 1: Overview Dataset Info',
        content: <OverviewDatasetInfoContent/>
    },
    {
        title: 'Step 2: Explore Sample Info',
        content: <SampleListInfoContent/>
    },
    {
        title: 'Step 3: Select Workflow',
        content: <WorkflowSelectorContent/>
    },
    {
        title: 'Step 4: Explore Bin-Level CNA Heatmap',
        content: <BinLevelCNAHeatmapContent/>
    },
    {
        title: 'Step 5: Explore Gene-Level CNA Heatmap',
        content: <GeneLevelCNAHeatmapContent/>
    },
    {
        title: 'Step 6: Explore Term-Level CNA Heatmap',
        content: <TermLevelCNAHeatmapContent/>
    },
    {
        title: 'Step 7: Explore CNA Phylogenetic Tree',
        content: <CNAPhylogeneticTreeContent/>
    },
    {
        title: 'Step 8: Explore CNA Embedding Map',
        content: <CNAEmbeddingMapContent/>
    },
    {
        title: 'Step 9: Explore CNA Ploidy Stairstep',
        content: <CNAPloidyStairstep/>
    },
    {
        title: 'Step 10: Explore CNA Ploidy Distribution',
        content: <CNAPloidyDistribution/>
    },
    {
        title: 'Step 11: Focal CNA & Gene',
        content: <CNAFocalCNAContent/>
    }
]

const DatabaseTutorialModal = ({}) => {
    const { hasSeenTutorial, setHasSeenTutorial } = useDetailPageTutorialStore(state => state)
    const [current, setCurrent] = useState(0)
    const [tutorialContent, setTutorialContent] = useState('')
    const [visible, setVisible] = useState(false)


    const updateTutorialContent = useCallback((stepIndex) => {
        setTutorialContent(tutorialSteps[stepIndex].content)
    }, [])

    const next = () => {
        if (current < tutorialSteps.length - 1) {
            setCurrent(current + 1);
            updateTutorialContent(current + 1)
        }
    };

    const prev = () => {
        if (current > 0) {
            setCurrent(current - 1);
            updateTutorialContent(current - 1)
        }
    }

    const onStepClick = (current) => {
        setCurrent(current)
        updateTutorialContent(current)
    }

    const handleModalClose = () => {
        setCurrent(0)
        setTutorialContent('')
        setHasSeenTutorial()
        setVisible(false)
    }

    useEffect(() => {
        if (visible) {
            updateTutorialContent(0)
        }
    }, [updateTutorialContent, visible])

    useEffect(() => {
        if (!hasSeenTutorial) {
            setVisible(true)
        }
    }, [hasSeenTutorial])

    return (
        <Modal
            title={<Title level={2} style={{ margin: 0, marginTop: '8px' }}>Genome Detail Tutorial</Title>}
            open={visible}
            onCancel={handleModalClose}
            footer={[
                current > 0 && (
                    <Button key="prev" onClick={prev}>
                        Previous Step
                    </Button>
                ),
                current < tutorialSteps.length - 1 ? (
                    <Button key="next" type="primary" onClick={next}>
                        Next Step
                    </Button>
                ) : (
                    <Button key="gotit" type="primary" onClick={handleModalClose}>
                        Got it!
                    </Button>
                )
            ]}
            width='80%'
            centered
        >
            <Grid container sx={{ py: '12px' }}>
                <Grid item size={2.5}>
                    <Steps
                        progressDot
                        current={current}
                        onChange={onStepClick}
                        direction="vertical"
                        items={tutorialSteps.map((step) => ({
                            title: step.title,
                            // description: step.content,
                        }))}
                    />
                </Grid>
                <Grid item size={9} offset={0.5}>
                    <Box
                        sx={{
                            height: '75vh',
                            maxHeight: '75vh',
                            overflow: 'auto'
                        }}
                    >
                        {tutorialContent}
                    </Box>
                </Grid>
            </Grid>
        </Modal>
    )
}

export default DatabaseTutorialModal
