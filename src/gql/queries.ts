/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: me
// ====================================================

export interface me_me_rules_rule {
  prop: ArticleProp;
  type: FilterType;
  negate: boolean | null;
  value: string;
}

export interface me_me_rules {
  _id: string;
  createdAt: GqlDateTime;
  isActive: boolean;
  lastHitAt: GqlDateTime | null;
  hits: number;
  rule: me_me_rules_rule;
}

export interface me_me {
  _id: string;
  name: string;
  rules: me_me_rules[];
}

export interface me {
  me: me_me | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: authorize
// ====================================================

export interface authorize_authorize {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface authorize {
  authorize: authorize_authorize;
}

export interface authorizeVariables {
  authCode: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: refreshToken
// ====================================================

export interface refreshToken_refreshToken {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface refreshToken {
  refreshToken: refreshToken_refreshToken;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: logout
// ====================================================

export interface logout {
  logout: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ArticleProp {
  href = "href",
  title = "title",
}

export enum FilterType {
  contains = "contains",
  equal = "equal",
  matchRegexp = "matchRegexp",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
