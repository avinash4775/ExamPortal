var app=angular.module("examApp",["ui.router"]);
 
  window.baseUrl="https://4703-103-101-116-174.ngrok.io/examportal/"
app.config(function($stateProvider,$urlRouterProvider){
    $stateProvider
    .state("Choice",{
        url:"/choice",
        templateUrl:"./login_choice.html",
        controller:"ChoiceCtrl"
    })
    .state("faculty",{
        url:"/choice/faculty",
        templateUrl:"./faculty_login.html",
        controller:"faculty_loginCtrl"
    })
    .state("student",{
        url:"/choice/student",
        templateUrl:"student_login.html",
        controller:"student_loginCtrl"
    })
    .state("faculty_choice",{
        url:"/choice/faculty/faculty_choice",
        templateUrl:"faculty_choice.html",
        controller:"faculty_choiceCtrl"
    })
    .state("create_exam",{
        url:"/choice/faculty/create_exam",
        templateUrl:"./create_exam.html",
        controller:"create_examCtrl"
    })
    .state("evaluate_exam",{
        url:"/choice/faculty/evaluate_exam",
        templateUrl:"./evaluate.html",
        controller:"evaluate_examCtrl"
    })
    .state("student_dash",{
        url:"/student_dashboard",
        templateUrl:"./student_dashboard.html",
        controller:"Student_dashboardCtrl"
    })
    .state("attempt",{
        url:"/attempt_exam",
        templateUrl:"./attempt.html",
        controller:"attemptCtrl"
    })
    .state("edit",{
        url:"/edit_exam",
        templateUrl:"./edit.html",
        controller:"create_examCtrl"
    })
    .state("logout",{
        url:"/....",
        controller:"logoutCtrl"
    })
    .state("answersheet",{
        url:"/choice/faculty/answer_sheet",
        templateUrl:"./answer_sheet.html",
        controller:"evaluate_examCtrl"
    })
    $urlRouterProvider.otherwise("/choice");
});

app.controller("ChoiceCtrl",function($http,$state,$scope){
    $scope.$parent.avi=false;
           $scope.$parent.ajay=false;

});

app.controller("logoutCtrl",function($http,$state,$scope){
   
    $http({
        method:"GET",
        url:window.baseUrl+"logout",
        withCredentials:true
    }).then(
        function(response){
            swal("LOGGED OUT!","" ,"success");
            $scope.$parent.avi=false;
            $scope.$parent.ajay=false;
            $state.go("Choice");
        },
        function(response){
            swal(response.data,"" ,"error");
            
        }
    )
})

app.controller("faculty_loginCtrl",function($scope,$http,$state){
    $scope.$parent.ajay=false;
    $http({
        url: window.baseUrl + "evaluate_exams",
        method: "GET",
        withCredentials: true,
      }).then(
        function (response) {
            $state.go("faculty_choice");
        },
        function (response) {
          if (response.status == 401) {
            swal(  "Oops...","You are not authorized for the page", "warning");
            $state.go("logout");
          } 
          else {
    
    
    $scope.facultyLogin=function(){
        var faculty={
            username:$scope.username,
            password:$scope.password
        };
        $scope.isLoading=true;
        $http({
       method:"POST",
       url:window.baseUrl+"faculty_login",
       data:faculty,
       withCredentials:true
        }).then(
            function(response){
                $scope.isLoading=false;
                window.teacher =
                  response.data[0].first_name +
                  " " +
                  response.data[0].last_name;
                  swal("welcome "+window.teacher,"","success");
                $state.go("faculty_choice");
                $scope.$parent.ajay=true;
            },
            function(response){
                $scope.isLoading=false;
                swal(response.data,"" ,"warning");
                

            }
        )
        
    }
   }
})
});

app.controller("faculty_choiceCtrl",function($scope){
    $scope.$parent.ajay=true;
    $scope.$parent.teacher=window.teacher;
});

app.controller( "student_loginCtrl",function($scope,$http,$state){
    $scope.$parent.avi=false;
    $http({
        method:"GET",
        url:window.baseUrl+"upcoming_exams",
        withCredentials:true
    }).then(
        function(response){
         $state.go("student_dash");
        },
        function (response) {
            if (response.status == 401) {
              swal(  "Oops...","You are not authorized for the page", "warning");
              $state.go("logout");
            } else {

    $scope.studentLogin=function(){
        var student={
            username:$scope.username,
            password:$scope.password
        };
        $scope.isLoading=true;
        $http({
       method:"POST",
       url:window.baseUrl+"student_login",
       data:student,
       withCredentials:true
        }).then(
            function(response){
                $scope.isLoading=false;
                window.vidyarthi =
                  response.data[0].first_name +
                  " " +
                  response.data[0].last_name;
                  swal("welcome "+window.vidyarthi,"","success");
                $state.go("student_dash");
                $scope.$parent.avi=true;
            },
            function(response){
                $scope.isLoading=false;
                swal(response.data,"" ,"error");

            }
        )
        
    }
  }
    
})
});

app.controller("create_examCtrl",function($scope,$http,$state){
    $scope.$parent.avi=false;
           $scope.$parent.ajay=true;
    $scope.test=[];
    $scope.status=false;
  $scope.status1=false;
  $scope.status2=false;
 $scope.dropdown1="Select";
 $scope.dropdown2="Select";
 $scope.select=function(name){
     $scope.dropdown1=name;
     $scope.dropdown2="Select";
 }
 $scope.select2=function(name){
     $scope.dropdown2=name;
 }

    $http({
        method:"GET",
        url:window.baseUrl+"get_courses",
        withCredentials:true,
    }).then(function(response){
        $scope.Courses=response.data;
        console.log(response.data);
    },function(response){
        swal(response.data,"" ,"error");
    }
    
    )
  
  $scope.branch=function(name){
      $scope.Branches=[];
      $http({
          method:"GET",
          url:window.baseUrl+"get_branches",
          withCredentials:true,
          params:{s_no:name}

      }).then(
          function(response){
              console.log(response.data);
              $scope.Branches=response.data;
          },
          function(response){
            swal(response.data,"" ,"error");
          }
      )
  }

   

    $scope.createForm=function(){   //only for validating and opening the exam form
        if($scope.dropdown1=="Select")
        {
            swal("SELECT COURSE","" ,"warning");
            return;
        }
        else if($scope.dropdown2=="Select")
        {
            swal("SELECT BRANCH","" ,"warning");
            return;
        } 
        else if(!$scope.startdate)
        {
            swal("ENTER START DATE","" ,"warning");
            return;
        } 
      else  if(!$scope.enddate)
        {
           swal("ENTER END DATE","" ,"warning");
            return;
        } 
       else if(!$scope.starttime)
        {
            swal("ENTER START TIME","" ,"warning");
            return;
        }
         
       else if(!$scope.endtime)
        {
            swal("ENTER END TIME","" ,"warning");
            return;
        } 
       else if(!$scope.examtitle)
        {
            swal("ENTER EXAM TITLE","" ,"warning");
            return;
        } 
       else if(!$scope.subject)
        {
            swal("ENTER SUBJECT","" ,"warning");
            return;
        }
         else if (!$scope.maxmarks)
         {
            swal("ENTER MAX MARKS","" ,"warning");
            return; 
         }
         else if($scope.maxmarks>100)
         {
            swal("CHECK MAX MARKS","MAX MARKS CAN'T BE GREATER THAN 100" ,"warning");
            return; 
         }

        function pad2(n) {
            return (n < 10 ? '0' : '') + n;
          }
          
          var date1 = new Date($scope.startdate);
          var month1 = pad2(date1.getMonth()+1);//months (0-11)
          var day1 = pad2(date1.getDate());//day (1-31)
          var year1= date1.getFullYear();
          var startdate =  year1+"-"+month1+"-"+day1;

          function pad2(n) {
            return (n < 10 ? '0' : '') + n;
          }
          
          var date2 = new Date($scope.enddate);
          var month2 = pad2(date2.getMonth()+1);//months (0-11)
          var day2 = pad2(date2.getDate());//day (1-31)
          var year2= date2.getFullYear();
          var enddate =  year2+"-"+month2+"-"+day2;
           if(year1>year2)
           {
               swal("START YEAR CAN'T BE GREATER THAN END YEAR","","warning");
               return;
           }
           else if(year1==year2&& month1>month2)
           {
            swal("START DATE CAN'T BE GREATER THAN END DATE","","warning");
            return; 
           }
           else if(year1==year2&& month1==month2 && day1>day2)
           {
            swal("START DATE CAN'T BE GREATER THAN END DATE","","warning");
            return;   
           }
          var d1=new Date($scope.starttime);
          hour1=d1.getHours();
          min1=d1.getMinutes();
          var starttime=('00'+d1.getHours()).slice(-2)+":"+("00"+d1.getMinutes()).slice(-2)+":"+("00"+d1.getSeconds()).slice(-2);
          var d2=new Date($scope.endtime);
          hour2=d2.getHours();
          min2=d2.getMinutes();
          var endtime=('00'+d2.getHours()).slice(-2)+":"+("00"+d2.getMinutes()).slice(-2)+":"+("00"+d2.getSeconds()).slice(-2);

            if(year1==year2&&month1==month2&&day1==day2&&hour1>hour2)
            {
                swal("START TIME CAN'T BE GREATER THAN END TIME","","warning");
            return; 
            }
            else if(year1==year2&&month1==month2&&day1==day2&&hour1==hour2&&min1>min2)
            {
                swal("START TIME CAN'T BE GREATER THAN END TIME","","warning");
            return; 
            }
            else if(year1==year2&&month1==month2&&day1==day2&&hour1==hour2&&min1==min2)
            {
                swal("START TIME CAN'T BE EQUAL TO END TIME","","warning");
            return; 
            }
        var exam={
         course:$scope.dropdown1,
         branch:$scope.dropdown2,
         subject:$scope.subject,
         exam_title:$scope.examtitle,
         end_date:enddate,
         start_date:startdate,
         start_time:starttime,
         end_time:endtime,
         max_marks:$scope.maxmarks
        }
        
        $scope.status1=true;
    }


    $scope.Questions = [];
  
   $scope.addQuestion= function() {
       var newQuestion = {};
       $scope.Questions.push(newQuestion);
   }
   
   $scope.removeQuestion = function(ques) {
       var index = $scope.Questions.indexOf(ques);
       $scope.Questions.splice(index,1);
   }
   

    //for sending the data to database

    $scope.createForm1=function(){ 
        $scope.$parent.submitexam=true;
        let i = 0;
        let sum=0;
        while (i < $scope.Questions.length) {
            if(! $scope.Questions[i].quest){
                swal("ENTER THE QUESTION!","" ,"error");
                $scope.$parent.submitexam=false;
                return;
            }
           else if(! $scope.Questions[i].max_marks){
                swal("ENTER THE MAX MARKS!","Enter The Maximum Marks For Each Question " ,"error");
                $scope.$parent.submitexam=false;
                return;
            }
            sum=sum+parseInt($scope.Questions[i].max_marks);
          i++;
        }
           
          if(sum!=parseInt($scope.maxmarks))
          {
            swal("MAX MARKS NOT EQUAL TO SUM OF INDIVIDUAL MARKS","" ,"warning");
            $scope.$parent.submitexam=false;
            return; 
          }

        function pad2(n) {
            return (n < 10 ? '0' : '') + n;
          }
          
          var date1 = new Date($scope.startdate);
          var month1 = pad2(date1.getMonth()+1);//months (0-11)
          var day1 = pad2(date1.getDate());//day (1-31)
          var year1= date1.getFullYear();
          var startdate =  year1+"-"+month1+"-"+day1;

          function pad2(n) {
            return (n < 10 ? '0' : '') + n;
          }
          
          var date2 = new Date($scope.enddate);
          var month2 = pad2(date2.getMonth()+1);//months (0-11)
          var day2 = pad2(date2.getDate());//day (1-31)
          var year2= date2.getFullYear();
          var enddate =  year2+"-"+month2+"-"+day2;

          var d1=new Date($scope.starttime);
          hour1=d1.getHours();
          min1=d1.getMinutes();
          var starttime=('00'+d1.getHours()).slice(-2)+":"+("00"+d1.getMinutes()).slice(-2)+":"+("00"+d1.getSeconds()).slice(-2);
          var d2=new Date($scope.endtime);
          hour2=d2.getHours();
          min2=d2.getMinutes();
          var endtime=('00'+d2.getHours()).slice(-2)+":"+("00"+d2.getMinutes()).slice(-2)+":"+("00"+d2.getSeconds()).slice(-2);

        var exam={
            course:$scope.dropdown1,
            branch:$scope.dropdown2,
            subject:$scope.subject,
            exam_title:$scope.examtitle,
            end_date:enddate,
            start_date:startdate,
            start_time:starttime,
            end_time:endtime,
            max_marks:$scope.maxmarks
           }
           
        $http({
            method:"POST",
            url:window.baseUrl+"create_form",
            data:exam,
            withCredentials:true
    
        }).then(
            function(response){
                $scope.isLoading=false;
                $scope.t=response.data[0].id;

                let i = 0;
                while (i < $scope.Questions.length) {
                  $scope.Questions[i].ans = "";
                  $scope.Questions[i].marks = "";
                  $scope.Questions[i].remark = "";
                  i++;
                }
                   var list={
                       id:$scope.t,
                       question:$scope.Questions
                   }
                console.log(list);
                   $http({
                       method:"POST",
                       url:window.baseUrl+"create_exam",
                       data:list,
                       withCredentials:true
                   }).then(
                       function(response){
                        swal("SUBMITTED!","" ,"success");
                           $scope.status1=false;
                          $scope.show();
                          $scope.$parent.submitexam=false;
                       },
                       function(response){
                           alert(response.status);
                           $scope.$parent.submitexam=false;
                       }
                   )



                $scope.dropdown1 = "Select";
                $scope.dropdown2 = "Select";
                $scope.subject = "";
                $scope.examtitle = "";
                $scope.maxmarks="";
                $scope.startdate = null;
                $scope.enddate = null;
                $scope.starttime = null;
                $scope.endtime = null;
                console.log(response.data);
            },
            function(response){
                $scope.isLoading=false;
                swal(response.status,"","error");
            }
            )
    }

    $scope.show=function(){
        if($scope.status==true){
            $scope.status=false;
            return;
        }
        $scope.isLoading=true;
        $scope.forms=[];
        $http({
            method:"GET",
            url:window.baseUrl+"get_examforms",
            withCredentials:true
        }).then(
            function(response){
            $scope.status=true;
            $scope.forms=response.data;
            console.log(response.data);
            $scope.isLoading=false;
            },
            function(response){
                swal(response.data,"","error");
            }
        )
    }

    $scope.add=function(){
        $scope.status2=true;
    }
    
    $scope.edit=function(t){
        window.updateid=t;
        $http({
            method:"GET",
            url:window.baseUrl+"view_exam",
            withCredentials:true,
            params:{"id":t}
        }).then(
            function(response){
                $scope.questions=response.data;
                window.question1=$scope.questions[0].question
                console.log(window.question1);
                $state.go("edit")

            },function(response){
                swal(response.data,"" ,"error");
            }
        )
    }
    $scope.sets=window.question1;
    
    $scope.delete=function(z){
   $http({
       method:"GET",
       url:window.baseUrl+"delete_examform",
       params:{"id":z},
       withCredentials:true
   }).then(
       function(response){
        swal(response.data,"" ,"success");
           $scope.show();
       },
       function(response){
        swal(response.data,"" ,"error");
       }
   )
    }



   $scope.update = function () {
       
    var updatequestion = {
      id: window.updateid,
      question: $scope.sets,
    };
    
    $http({
              url: window.baseUrl + "update_exam",
              method: "POST",
              withCredentials: true,
              data: updatequestion,
            }).then(function (response) {
                swal("SUCCESS","Updated Successfuly","success");
              $state.go("create_exam");
            },function(response){
                swal(response.data,"","error");
            }
            );
  };


});


app.controller("evaluate_examCtrl",function($scope,$http,$state){
    $scope.$parent.avi=false;
           $scope.$parent.ajay=true;
    $scope.isLoading=true;
    $scope.isLoading2=true
    $scope.status4=false;
    $scope.exams=[];
    $scope.exam_evaluate=[];
   
    $http({
        method:"GET",
        url:window.baseUrl+"evaluate_exams",
        withCredentials:true
    }).then(
        function(response){
            $scope.isLoading=false;
           $scope.exams=response.data;
        },
        function(response){
            $scope.isLoading=false;
            alert(response.status);
        }
    )

    $http({
        method:"GET",
        url:window.baseUrl+"view_evaluated",
        withCredentials:true
    }).then(
        function(response){
            $scope.isLoading2=false;
           $scope.evaluated_exam=response.data;
        },
        function(response){
            $scope.isLoading2=false;
            alert(response.status);
        }
    )

 $scope.evaluate=function(id){
     $scope.status4=false;
     $scope.isLoading1=true;
     $scope.submission=[];
     window.paper_id=id;
    $http({
        method:"GET",
        url:window.baseUrl+"evaluate",
        params:{"id":id},
        withCredentials:true
    }).then(
        function(response){

            $scope.exam_evaluate=response.data;
            window.exam_evaluate1=response.data;
            $scope.title1 =
        $scope.exam_evaluate[1][0].subject + " - " + $scope.exam_evaluate[1][0].exam_title;
            $scope.submission=$scope.exam_evaluate[0];
            $scope.isLoading1=false;
            $scope.status4=true;
        },
        function(response){
            alert(response.status);
            $scope.isLoading1=false;

        }
    )

 }

 $scope.viewAnswer=function(t){
     $scope.$parent.viewansw=true;
    window.ansid = t;
    window.first_name1 = window.exam_evaluate1[0][window.ansid].first_name;
    window.mobileno1 = window.exam_evaluate1[0][window.ansid].mobile_no;
    window.user_name1 = window.exam_evaluate1[0][window.ansid].username;

     $http({
         method:"GET",
         url:window.baseUrl+"view_ans",
         params:{user_id:t,paper_id:window.paper_id},
         withCredentials:true
     }).then(
         function(response){
             console.log(response.data);
            window.answerSheet= response.data[0].ans;
            window.answersheetid=response.data[0].id;
            window.answersheetmax=response.data[0].paper_id__max_marks;
            $scope.$parent.viewansw=false;
            console.log(response.data);
            $state.go("answersheet");
         },
         function(response){
            $scope.$parent.viewansw=false;
             alert(response.status);
         }
     )
 }
 $scope.answer_sheet=window.answerSheet;
 $scope.studentfname = window.first_name1;
 $scope.studentuser_name = window.user_name1;
 $scope.studentmobileno = window.mobileno1;
 $scope.answermaxmarks=  window.answersheetmax;

 $scope.evaluate_answer=function(){
    let i = 0;
    let sum=0;
    while (i < $scope.answer_sheet.length) {
        if(! $scope.answer_sheet[i].marks){
            swal("ENTER THE OBTAINED MARKS!","" ,"error");
            return;
        }
        if($scope.answer_sheet[i].max_marks<$scope.answer_sheet[i].marks)
        {
            swal("WARNING!","Obtained Marks Can't Be Greater Than Maximum Marks " ,"error");
            return;
        }
        sum=sum+parseInt($scope.answer_sheet[i].marks);
      i++;
    }
   

     var ev_ans={
         id:window.answersheetid,
         total_marks:sum,
         question:$scope.answer_sheet
     }
     console.log(ev_ans);
     $http({
         method:"POST",
         url:window.baseUrl+"evaluate_marks",
         data:ev_ans,
         withCredentials:true
     }).then(
         function(response){
            swal("SUCCESS","Answer Sheet Evaluated Successfuly","success");
            $state.go("evaluate_exam");
         },
         function(response){
            swal("FAILURE","Not Evaluated","error");
         }
     )
 }

});

app.controller("Student_dashboardCtrl",function($scope,$http,$state){
    $scope.$parent.vidyarthi=window.vidyarthi;
    $scope.$parent.avi=true;
    $scope.$parent.ajay=false;
    $scope.statuslive=true;
    $scope.statusupcom=true;
    $scope.statusprev=true;
    $http({
        method:"GET",
        url:window.baseUrl+"upcoming_exams",
        withCredentials:true
    }).then(
        function(response){
        $scope.upcoming=response.data;
        $scope.upcomingexam=response.data;
            $scope.statusupcom=false;         
//    { 
//      
     
//       var countDownDate = new Date(window.upcomingexam1).getTime();
//       window.upcomingtimer=[];
//     var x = setInterval(function () {
    //let i=0;
    //     while(i< $scope.upcomingexam.length){
 //   window.upcomingexam1= $scope.upcomingexam[i].end_date+" "+ $scope.upcomingexam[i].end_time;}
//       var now = new Date().getTime();
//       var distance = countDownDate - now;
//       var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       var hours = Math.floor(
//         (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//       );
//       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       var seconds = Math.floor((distance % (1000 * 60)) / 1000);
//       $scope.upcomingtimer =
//         days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
     
//       if (distance < 0) {
//         clearInterval(x);
//         window.upcomingtimer = "EXPIRED";

//       }
//       $scope.$apply();
//     }, 1000);
     
    // $scope.upcomingexam[i].countdown=window.upcomingtimer;
    // i++;
    // 
    // $scope.upcoming=$scope.upcomingexam;
        },
        function(response){
            alert(response.status);
        }
    )

   
   console.log($scope.upcomingexam);
   $http({
       method:"GET",
       url:window.baseUrl+"live_exams",
       withCredentials:true
   }).then(
       function(response){
           $scope.live=response.data;
           window.liveexam = response.data;
           $scope.statuslive=false;
       },
       function(response){
           alert(response.status);
       }
   )

   $http({
    method:"GET",
    url:window.baseUrl+"previous_exams",
    withCredentials:true
    }).then(
    function(response){
        $scope.previous=response.data;
        $scope.statusprev=false;
    },
    function(response){
        alert(response.status);
    }
  )

  $scope.getquestion=function(t,index){
      window.id=t;
    $http({
        method:"GET",
        url:window.baseUrl+"get_ques",
        params:{id:t},
        withCredentials:true
    }).then(
        function(response){
            $scope.questions=response.data;
            window.question1=$scope.questions[0].question;
            window.max_marksget=$scope.questions[0].paper_id__max_marks;
            window.liveexam2 =
              window.liveexam[index].end_date +
              " " +
              window.liveexam[index].end_time;

            console.log(response.data);

            
            
            $state.go("attempt");
        },
        function(response){
            alert(response.status);
        }
        )
    }
   

});

app.controller("attemptCtrl",function($scope,$state,$http){
    $scope.$parent.avi=true;
           $scope.$parent.ajay=false;
    var countDownDate = new Date(window.liveexam2).getTime();

    var x = setInterval(function () {
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      $scope.timer =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
     
      if (distance < 0) {
        clearInterval(x);
        $scope.timer = "EXPIRED";
        $scope.Submittest();
      }
      $scope.$apply();
    }, 1000);

   $scope.Questions=window.question1;
  $scope.max_mark= window.max_marksget;
   $scope.Submittest = function () {
    var answer = {
      id: window.id,
      question: $scope.Questions,
    };
    console.log(answer);
    $http({
      url: window.baseUrl + "attempt_exam",
      method: "POST",
      withCredentials: true,
      data: answer,
    }).then(function (response) {
        swal("SUBMITTED!","" ,"success");
      $state.go("student_dash");
    },function(response){
        alert(response.status);
    }
    );
  };
})