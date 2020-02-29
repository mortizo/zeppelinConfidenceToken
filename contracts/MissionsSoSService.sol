pragma solidity  >=0.5.16 <0.7.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ConfidenceToken.sol";


contract MissionsSoSService{

    using SafeMath for uint;

    enum HTTPMethod  {GET, POST, PATCH, PUT, DELETE}
    enum ContentType {none, data, URL_encoded, raw, binary, GraphQL}
    enum RAWDataType {none, Text, JavaScript, JSON, HTML, XML}
    enum EnumState {CANDIDATE, AVAILABLE, UNAVAILABLE}

   struct Mission {
        uint missionCode;
        string missionDescription;
        address missionOwner;
        string missionTag;
    }

    struct Parameter {
        string parameterKey;
        string parameterValue;
        string parameterDescription;
    }

    struct Constituent {
        uint constituentCode;
        address constituentOwner;
    }

    struct Service {
        uint serviceCode;
        string serviceDescription;
        HTTPMethod serviceHTTPMethod;
        string serviceURL;
        ContentType serviceContentType;
        RAWDataType serviceRAWDataType;
    }

    struct State {
        uint stateCode;
        EnumState stateState;
        address stateOwner;
    }


    //--------Mission---------
    uint private _totalMission;
    mapping(uint => Mission) private missionMap;

    //-------Mission SuperMission-------
    mapping(uint => uint) private _totalMissionSuperMission;
    mapping(uint => uint) private missionSuperMissionMap;

    //-------Constituent-------
    uint private _totalConstituent;
    mapping(uint => Constituent) private constituentMap;
    //--Constituent Parameter--
    mapping(uint => uint) private _totalConstituentParameter;
    mapping(uint => Parameter[]) private constituentParameterMap;
    //---Constituent Service---
    mapping(uint => uint) private _totalConstituentService;
    mapping(uint => Service[]) private constituentServiceMap;

    //-------Constituent Service Parameter-------
    mapping(uint => mapping(uint => uint)) private _totalConstituentServiceParameter;
    mapping(uint => mapping(uint => Parameter[])) private constituentServiceParameterMap;

    //-------State-------
    uint private _totalState;
    mapping(uint => State) private stateMap;

    //-------State Mission ---------
    mapping(uint => uint) private stateMissionMap;

    //-------State Constituent ---------
    mapping(uint => uint) private stateConstituentMap;

    //-------State Service ---------
    mapping(uint => uint) private stateServiceMap;


    //-------------Token-------------
    ConfidenceToken private confidenceToken;

    function confidenceTokenName() public view returns (string memory) {
        return confidenceToken.name();
    }

    //--------Mission---------

    constructor() public{
        confidenceToken = ConfidenceToken(0x99E9Af23C8982302DF19c652E6569E12E7F172d2);
    }

    function totalMission() public view returns (uint) {
        return _totalMission;
    }

    function setMission(string memory _missionDescription, string memory _missionTag) public {
        missionMap[_totalMission] = Mission(_totalMission, _missionDescription, msg.sender, _missionTag);
        _totalMission = _totalMission.add(1);
    }

    function mission(uint  _missionCode) public view returns (uint, string memory, address, string memory) {
        return (_missionCode,
            missionMap[_missionCode].missionDescription,
            missionMap[_missionCode].missionOwner,
            missionMap[_missionCode].missionTag
        );
    }

    //-----------Mission SuperMission -----------
    function totalMissionSuperMission(uint _missionCode) public view returns (uint) {
        return _totalMissionSuperMission[_missionCode];
    }

    function setMissionSuperMission(uint _missionCode, uint _superMissionCode) public {
        require(_missionCode>0&&_missionCode<_totalMission,"Mission don't exist");
        require(_superMissionCode>=0&&_superMissionCode<_missionCode,"SuperMission is equal or more than mission");
        missionSuperMissionMap[_missionCode] = _superMissionCode;
        _totalMissionSuperMission[_missionCode] = _totalMissionSuperMission[_missionCode].add(1);
    }

    function missionSuperMission(uint  _missionCode) public view returns (uint) {
        return (missionSuperMissionMap[_missionCode]);
    }

    //-------Constituent-------

    function totalConstituent() public view returns (uint) {
        return _totalConstituent;
    }

    function setConstituent() public {
        constituentMap[_totalConstituent] = Constituent(_totalConstituent, msg.sender);
        _totalConstituent = _totalConstituent.add(1);
    }

    function constituent(uint  _constituentCode) public view returns (uint, address) {
        return (_constituentCode, constituentMap[_constituentCode].constituentOwner);
    }

    //--Constituent Parameter--

    function setConstituentParameter(uint  _constituentCode,
    string memory _parameterKey,string memory _parameterValue,
    string memory _parameterDescription) public {
        require(msg.sender==constituentMap[_constituentCode].constituentOwner,"Only Constituent owner can add parameters");
        Parameter memory _parameter = Parameter(_parameterKey,
        _parameterValue, _parameterDescription);
        constituentParameterMap[_constituentCode].push(_parameter);
        _totalConstituentParameter[_constituentCode] = _totalConstituentParameter[_constituentCode].add(1);

    }

    function totalConstituentParameter(uint _constituentCode) public view returns (uint) {
        return _totalConstituentParameter[_constituentCode];
    }

    function constituentParameter(uint  _constituentCode,
    uint _parameterCode) public view returns (string memory, string memory, string memory) {
        return (constituentParameterMap[_constituentCode][_parameterCode].parameterKey,
            constituentParameterMap[_constituentCode][_parameterCode].parameterValue,
            constituentParameterMap[_constituentCode][_parameterCode].parameterDescription
        );
    }

    //--Constituent Service----

    function setConstituentService(uint  _constituentCode,
    string memory _serviceDescription,uint _serviceHTTPMethod,
    string memory serviceURL, uint _serviceContentType,
    uint _serviceRAWDataType) public {
        require(msg.sender==constituentMap[_constituentCode].constituentOwner,"Only Constituent owner can add services");
        Service memory _service = Service(_totalConstituentService[_constituentCode],
        _serviceDescription, HTTPMethod(_serviceHTTPMethod),serviceURL,
        ContentType(_serviceContentType),RAWDataType(_serviceRAWDataType));
        constituentServiceMap[_constituentCode].push(_service);
        _totalConstituentService[_constituentCode] = _totalConstituentService[_constituentCode].add(1);
    }

    function totalConstituentService(uint _constituentCode) public view returns (uint) {
        return _totalConstituentService[_constituentCode];
    }

    function constituentService(uint  _constituentCode,uint _serviceCode)
    public view returns (uint, string memory, HTTPMethod,string memory,ContentType,RAWDataType) {
        return (_serviceCode,
            constituentServiceMap[_constituentCode][_serviceCode].serviceDescription,
            constituentServiceMap[_constituentCode][_serviceCode].serviceHTTPMethod,
            constituentServiceMap[_constituentCode][_serviceCode].serviceURL,
            constituentServiceMap[_constituentCode][_serviceCode].serviceContentType,
            constituentServiceMap[_constituentCode][_serviceCode].serviceRAWDataType
        );
    }

    //--Constituent Service Parameter--

    function setConstituentServiceParameter(uint  _constituentCode,uint  _serviceCode,
    string memory _parameterKey,string memory _parameterValue,
    string memory _parameterDescription) public returns (bool) {
        require(msg.sender==constituentMap[_constituentCode].constituentOwner,"Only Constituent owner can add parameters to services");
        Parameter memory _parameter = Parameter(_parameterKey, _parameterValue,_parameterDescription);
        constituentServiceParameterMap[_constituentCode][_serviceCode].push(_parameter);
        uint auxTotal = _totalConstituentServiceParameter[_constituentCode][_serviceCode];
        _totalConstituentServiceParameter[_constituentCode][_serviceCode] = auxTotal.add(1);
    }

    function totalConstituentServiceParameter(uint _constituentCode,
    uint _serviceCode) public view returns (uint) {
        return _totalConstituentServiceParameter[_constituentCode][_serviceCode];
    }

    function constituentServiceParameter(uint  _constituentCode,
    uint _serviceCode, uint _parameterCode)
    public view returns (string memory, string memory, string memory) {
        return (
            (constituentServiceParameterMap[_constituentCode][_serviceCode])[_parameterCode].parameterKey,
            (constituentServiceParameterMap[_constituentCode][_serviceCode])[_parameterCode].parameterValue,
            (constituentServiceParameterMap[_constituentCode][_serviceCode])[_parameterCode].parameterDescription
        );
    }

    //-----------State  -----------

    function totalState() public view returns (uint) {
        return _totalState;
    }

    function setState(uint _stateState) public {
        require(_stateState>=0&&_stateState<=2,"CANDIDATE: 0, AVAILABLE: 1, UNAVAILABLE: 2");
        stateMap[_totalState] = State(_totalState, EnumState(_stateState), msg.sender);
        _totalState = _totalState.add(1);
    }

    function state(uint  _stateCode) public view returns (uint, EnumState, address) {
        return (_stateCode,
            stateMap[_stateCode].stateState,
            stateMap[_stateCode].stateOwner
        );
    }

    //-----------State Mission Constituent Service -----------

    function setStateMissionConstituentService(uint _stateCode,uint _missionCode,
    uint _constituentCode, uint _serviceCode) public {
        require(_stateCode>=0 && _stateCode<totalState(),"State don't exists");
        require(_missionCode>=0 && _missionCode<totalMission(),"Mission don't exist");
        require(_constituentCode>=0 && _constituentCode<totalConstituent(),"Constituent don't exist");
        require(_serviceCode>=0 && _serviceCode<totalConstituentService(_constituentCode),"Service don't exist");
        stateMissionMap[_stateCode] = _missionCode;
        stateConstituentMap[_stateCode] = _constituentCode;
        stateServiceMap[_stateCode] = _serviceCode;
    }

    function stateMissionConstituentService(uint _stateCode)
    public view returns (uint, uint, uint, uint){
        return (
            _stateCode,
            stateMissionMap[_stateCode],
            stateConstituentMap[_stateCode],
            stateServiceMap[_stateCode]
        );
    }

}