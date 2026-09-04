
import http from './http';

import { mapAgencyFromApi } from './agency-mapper/agency-mapper';

export const releaseLatest = () =>
    http.get('/releases/latest');


export const getProvinces = (countryCode = 'ES') =>
    http.get(`/locations/countries/${countryCode}/provinces`);

export const getProvince = (countryCode, postalCode) => 
    http.get(`/locations/countries/${ countryCode }/provinces/${ postalCode }`)

export const listCountries = (lang = 'ES') =>
    http.get(`/locations/countries`, { params: { lang } });


export const getCompareRatesByPostalCode = (data) => 
    http.post('/rates/compare/postal-code', data);


export const createAgency = (data) => 
    http.post(`/agencies`, mapAgencyFromApi({ data }));

export const getAgency = (agencyId) => 
    http.get(`/agencies/${ agencyId }`);

export const updateAgency = (agencyId, data) =>
    http.patch(`/agencies/${ agencyId }`, mapAgencyFromApi({ isEdit: true , data }));

export const listAgencies = () => 
    http.get('/agencies');

export const setActiveAgency = (agencyId) =>
    http.patch(`/agencies/${ agencyId }/active`)

export const updateFuelSurchargeAgency = (agencyId, data) =>
    http.patch(`/agencies/${ agencyId }/supplements/fuel-surcharge`, data);

export const deleteAgency = (agencyId) => 
    http.delete(`/agencies/${ agencyId }`);


export const getRecentActivitiesAudit = (filters = {}) =>
    http.get('/audits/recent-activity', { params: filters });

export const getActivityAudit = (activityId) => 
    http.get(`/audits/${ activityId }`);

export const getMostCodePostalAudit = () =>
    http.get('/audits/most-queried-postal');

export const getStatsAudit = () => 
    http.get('/audits/stats');