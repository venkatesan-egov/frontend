import {
  getCommonHeader,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { setServiceCategory } from "../utils";
import { UCSearchCard } from "./receiptsResources/ucSearch";
import { searchResult } from "./receiptsResources/searchResult";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

const tenantId = getTenantId();
const header = getCommonHeader({
  labelName: "Receipt",
  labelKey: "UC_RECEIPT"
});

const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};

const getMDMSData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "BillingService",
          masterDetails: [
            { name: "BusinessService", filter: "[?(@.type=='Adhoc')]" }
          ]
        }
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
        setServiceCategory(
      get(payload, "MdmsRes.BillingService.BusinessService", []),
      dispatch
    );
   
  } catch (e) {
    console.log(e);
  }
};

const ucSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "universalCollection"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        UCSearchCard,
        breakAfterSearch: getBreak(),
        searchResult
      }
    }
  }
};

export default ucSearchAndResult;
