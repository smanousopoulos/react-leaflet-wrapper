import React from 'react';
import L from 'leaflet';

import ControlHandlers from './handlers/';

class GeoJSON  extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseover: null,
      click: null
    };
  }

  componentWillMount() {
    this.layer = L.geoJson(this.props.data, { 
      onEachFeature: this.onEachFeature.bind(this),
      pointToLayer: this.props.circleMarkers ? this.pointToCircleMarker.bind(this) : this.pointToMarker.bind(this),
      ...this.props,
    }).addTo(this.props.map);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data === null) {
      this.layer.clearLayers();
    }
    if (nextProps.data && nextProps.data !== this.props.data) {
      this.layer.clearLayers();
      this.layer.addData(nextProps.data);
    }
  }

  componentWillUnmount() {
    this.layer.remove();
  }

  featureClick(feature, layer) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(feature, layer, this.props.map);
    }

    this.setState({ click: feature });
  }

  featureMouseover(feature, layer) {
    if (this.props.highlightStyle && (layer.feature.geometry.type !== 'Point' || this.props.circleMarkers)) {
      layer.setStyle(this.props.highlightStyle);
    }
    
    this.setState({ mouseover: feature });
  }

  featureMouseout(feature, layer) {
    if (this.props.highlightStyle && (layer.feature.geometry.type !== 'Point' || this.props.circleMarkers)) {
    this.layer.resetStyle(layer);
    }
    this.setState({ mouseover: null });
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.featureMouseover.bind(this, feature, layer),
      mouseout: this.featureMouseout.bind(this, feature, layer),
      click: this.featureClick.bind(this, feature, layer)
    }); 
  }

  pointToCircleMarker(point, latlng) {
    return L.circleMarker(latlng, this.props.markerStyle || this.props.style);
  }

  pointToMarker(point, latlng) {
    return L.marker(latlng, this.props.markerOptions);
  }

  render() {
    return (
        <ControlHandlers
          layer={this.layer}
          click={this.state.click}
          mouseover={this.state.mouseover}
          {...this.props} 
        />
    );
  }
}

GeoJSON.defaultProps = {
  data: null,
  style: {},
  info: null,
  name: '',
  circleMarkers: false,
  controlledLayer: true,
};


module.exports = GeoJSON;
