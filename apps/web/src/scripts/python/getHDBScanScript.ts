export type DataPoint = { x: number; y: number }

export type HDBScanArgs = {
	data: DataPoint[]
	min_cluster_size: number
	min_samples: number
	cluster_selection_epsilon: number
	allow_single_cluster: boolean
	warmup?: boolean
}
export const HDBSCAN_ARGS_DEFAULTS = {
	data: [],
	min_cluster_size: 3,
	min_samples: 1,
	cluster_selection_epsilon: 50,
	allow_single_cluster: true,
	warmup: false,
}

export type HDBScanOutputType = {
	cluster_labels: Int32Array
}

export type HDBScanOutput = Map<
	keyof HDBScanOutputType,
	HDBScanOutputType[keyof HDBScanOutputType]
>

export const HDBScanScript = `
import pandas as pd
import hdbscan

if warmup is True:
	output = {
		"cluster_labels": []
	}
else:
	df = pd.DataFrame(data)
	clustering = hdbscan.HDBSCAN(min_cluster_size=min_cluster_size, min_samples=min_samples, cluster_selection_epsilon=cluster_selection_epsilon, allow_single_cluster=allow_single_cluster)
	cluster_labels =  clustering.fit_predict(df)
	output = {
		"cluster_labels": cluster_labels
	}

output`

export const getHDBScanArgs = (data: Partial<HDBScanArgs>): HDBScanArgs => ({
	...HDBSCAN_ARGS_DEFAULTS,
	...data,
})
