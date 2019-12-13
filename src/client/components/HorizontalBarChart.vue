<script lang="ts">
    import {Mixins, Component, Prop} from "vue-property-decorator";
    import {HorizontalBar, mixins} from "vue-chartjs";
    import * as Chart from "chart.js";

    @Component
    export default class extends Mixins(HorizontalBar, mixins.reactiveProp) {
        @Prop() public chartData: Chart.ChartData;
        @Prop() public chartOptions: Chart.ChartOptions;

        public mounted() {
            this.renderChart(this.chartData, this.chartOptions);
        }
    }
</script>
