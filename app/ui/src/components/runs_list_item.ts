import {WeyaElementFunction} from '../../../lib/weya/weya'
import {RunListItem} from '../models/run_list'
import {StatusView} from './status'
import {formatTime} from '../utils/time'
import {ConfigItemView} from "../analyses/experiments/configs/components";
import {BadgeView} from "./badge"

export interface RunsListItemOptions {
    item: RunListItem
    onClick: (elem: RunsListItemView) => void
    width: number
}

export class RunsListItemView {
    public elem: HTMLElement
    public item: RunListItem
    private readonly onClick: (evt: Event) => void
    private readonly width: number
    static readonly METRIC_LIMIT = 3

    constructor(opt: RunsListItemOptions) {
        this.item = opt.item
        this.width = opt.width
        this.onClick = (e: Event) => {
            e.preventDefault()
            opt.onClick(this)
        }
    }

    render($: WeyaElementFunction) {
        this.elem = $('a', '.list-item.list-group-item.list-group-item-action',
            {href: `/run/${this.item.run_uuid}`, on: {click: this.onClick}},
            $ => {
                new StatusView({status: this.item.run_status, isDistributed: this.item.world_size>0}).render($)
                $('div', '.spaced-row', $ => {
                    $('div', $ => {
                        $('p', `Started on ${formatTime(this.item.start_time)}`)
                        $('h5', this.item.name)
                        $('h6', this.item.comment)
                    })
                    $('div', $ => {
                        $('div.info_list.config.custom.label', $ => {
                            if (this.item.step != null) {
                                $('span',  `${this.item.step} Steps`)
                            }
                        })
                    })
                })
                $('div', '.spaced-row', $ => {

                        if (this.item.metric_values != null && this.item.metric_values.length != 0) {
                            $('div', $ => {
                                $('span', 'Metrics: ')
                                this.item.metric_values.slice(0, RunsListItemView.METRIC_LIMIT).map((m, idx) => {
                                    $('div.info_list.config.custom', $ => {
                                        $('span.key', m.name)
                                        $('span', `${m.value.toExponential(4)}`)
                                    })
                                })
                                if (this.item.metric_values.length > RunsListItemView.METRIC_LIMIT) {
                                    $('div.break.text-secondary', `+${this.item.metric_values.length - RunsListItemView.METRIC_LIMIT} more`)
                                }
                            })
                        }


                    $('div', $ => {
                        if (this.item.favorite_configs != null && this.item.favorite_configs.length != 0) {
                            $('span', 'Configs: ')
                            this.item.favorite_configs.map((c) => {
                                new ConfigItemView({
                                    config: c,
                                    configs: this.item.favorite_configs,
                                    width: this.width-20,
                                    onTap: undefined,
                                    isSummary: true
                                }).render($)
                            })
                        }
                    })
                })
                $('span.tags', $ => {
                    this.item.tags.map((tag: any, _: any) => (
                        new BadgeView({text: tag}).render($)
                    ))
                })
            })
    }
}
