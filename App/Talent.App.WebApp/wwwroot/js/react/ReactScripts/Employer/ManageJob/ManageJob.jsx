import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Table, Pagination, Icon, Dropdown, Confirm, Checkbox, Accordion, Form, Segment, Button } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            JobsList: [],
            TotalCount: null,
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            showEllipsis: true,
            showFirstAndLastNav: true,
            showPreviousAndNextNav: true,            
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.JobsRecords = this.JobsRecords.bind(this);
        this.RecordsCount = this.RecordsCount.bind(this);


        
    };
    


    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
       // this.loadData(() =>
        //    this.setState({ loaderData })
       // )
        
       // console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        this.loadData();
        
    };

    loadData(callback) {
         
        
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?showActive=true&showExpired=true&showUnexpired=true&showClosed=false&showDraft=true';
        var cookies = Cookies.get('talentAuthToken');       
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let JobsList = null; 
                let TotalCount = null;
                if (res.success == true) {
                    JobsList = res.myJobs, 
                        TotalCount = res.totalCount
                    console.log("List jobs", JobsList)
                    console.log("count", TotalCount)
                }
                this.JobsRecords(JobsList);
                this.RecordsCount(TotalCount);
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            } 
        })
        this.init()
    }

    JobsRecords(List) {
        this.setState({
            JobsList: List
           
        })
    }

    RecordsCount(count) {
        this.setState({
            TotalCount: count
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    
    closeJob(Id) {
        var link = 'http://localhost:51689/listing/listing/closeJob';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,            
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'               
            },
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(Id),            
            success: function (res) {
                if (res.success == true) {
                    const updatedJob = this.state.JobsList.filter(record => record.id != Id);                   
                    this.setState({ JobsList: updatedJob });
                    TalentUtil.notification.show(res.message, "success", null, null); 
                    window.location = "/ManageJobs";
            } else {
                TalentUtil.notification.show(res.message, "error", null, null)
                }
                
            }.bind(this)
        })
    }

    render() {
        const { TotalCount } = this.state; 
        return (           
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                
                <div className="ui container" style={{ paddingLeft: '80px', paddingBottom: '20px' }}>            
                    <div className="nav">
                        <h2 className="nav center">List of Jobs</h2>
                        <Form >
                            <label><i className="filter icon"></i>Filter:</label>                            
                            <Dropdown style={{ fontFamily: 'sans-serif' }}                                                
                                name="Filter"
                                 placeholder=" Choose filter"                                   
                    />
                        <label><i className="calendar icon"></i>Sort by date:</label>
                        <Dropdown
                            name="sortbydate"
                            placeholder=" Newest first"
                        />
                        </Form>
                    </div>
                    <br />
                    {
                        TotalCount == '0' && <h2> No Jobs Found </h2>
                    }
                    <div className="ui link cards">
                        {this.state.JobsList.map(record => (
                            <div key={record.id} className="card" style={{ width: '350px', height: '330px', marginLeft: '20px' }}>

                                <div className="content">
                                    <div className="header">{record.title}</div>
                                    <div>
                                        <a className="ui black right ribbon label"> <i aria-hidden="true" className="user icon"></i>
                                            {record.noOfSuggestions} </a>
                                    </div>
                                    <div className="meta">
                                         {record.location.city}, {record.location.country}
                                    </div>
                                    
                                    <div className="description">
                                        {record.summary}
                                 </div>
                                </div>
                                <div className="extra">                                   
                                    <span className="left floated">
                                        <Button size='mini' color='red'>
                                            Expired
                                        </Button>
                                    </span>
                                    <span className="right floated ui buttons mini">
                                        <Button basic color='blue' onClick={() => this.closeJob(record.id)}>
                                            <i aria-hidden="true" className="ban icon"></i>
                                            close
                                        </Button>

                                        <Button basic color='blue' href={"/EditJob/" + record.id} > <i aria-hidden="true" className="edit icon"></i>
                                            edit
                                        </Button>
                                        <Button basic color='blue'><i aria-hidden="true" className="copy icon"></i>
                                            copy
                                         </Button>
                                    </span>
                                </div>
                            </div>    
                        ))}

                    </div>
                    
                    <div className="ui grid">
                        <div className="row">
                            <div className="sixteen wide center aligned padded column">
                                <div className="pagination">
                                    <span>&laquo;</span>
                                    <span>&#139;</span>
                                    <span>1</span>
                                    <span>&#155;</span>
                                    <span>&raquo;</span>
                                </div>
                            </div>
                        </div>
                        </div>                    
                </div>
               
            </BodyWrapper>           
        )
    }
}