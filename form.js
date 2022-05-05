
$(function()
{
    function after_form_submitted(data)
    {
        if(data.result == 'success')
        {
            $('form#theform').hide();
            $('.success_message').show();
            $('.error_message').hide();
        }
        else
        {
            $('.error_message').append('<ul></ul>');

            jQuery.each(data.errors,function(key,val)
            {
                $('.error_message ul').append('<li>'+key+':'+val+'</li>');
            });
            $('.success_message').hide();
            $('.error_message').show();

            //reverse the response on the button
            $('button[type="button"]', $form).each(function()
            {
                $btn = $(this);
                label = $btn.prop('orig_label');
                if(label)
                {
                    $btn.prop('type','submit' );
                    $btn.text(label);
                    $btn.prop('orig_label','');
                }
            });

        }//else
    }

	$('#theform').submit(function(e)
      {
        e.preventDefault();

        $form = $(this);
        //show some response on the button
        $('button[type="submit"]', $form).each(function()
        {
            $btn = $(this);
            $btn.prop('type','button' );
            $btn.prop('orig_label',$btn.text());
            $btn.text('Sending ...');
        });


                    $.ajax({
                type: "POST",
                url: 'handler.php',
                data: $form.serialize(),
                success: after_form_submitted,
                dataType: 'json'
            });

      });
});







$(function()
{
    function after_form_submitted(data)
    {
        if(data.result == 'success')
        {
            $('form#theform2').hide();
            $('.success_message2').show();
            $('.error_message2').hide();
        }
        else
        {
            $('.error_message2').append('<ul></ul>');

            jQuery.each(data.errors,function(key,val)
            {
                $('.error_message2 ul').append('<li>'+key+':'+val+'</li>');
            });
            $('.success_message2').hide();
            $('.error_message2').show();

            //reverse the response on the button
            $('button[type="button"]', $form).each(function()
            {
                $btn = $(this);
                label = $btn.prop('orig_label');
                if(label)
                {
                    $btn.prop('type','submit' );
                    $btn.text(label);
                    $btn.prop('orig_label','');
                }
            });

        }//else
    }

	$('#theform2').submit(function(e)
      {
        e.preventDefault();

        $form = $(this);
        //show some response on the button
        $('button[type="submit"]', $form).each(function()
        {
            $btn = $(this);
            $btn.prop('type','button' );
            $btn.prop('orig_label',$btn.text());
            $btn.text('Sending ...');
        });


                    $.ajax({
                type: "POST",
                url: 'handler.php',
                data: $form.serialize(),
                success: after_form_submitted,
                dataType: 'json'
            });

      });
});





$(function()
{
    function after_form_submitted(data)
    {
        if(data.result == 'success')
        {
            $('form#theform3').hide();
            $('.success_message3').show();
            $('.error_message3').hide();
        }
        else
        {
            $('.error_message3').append('<ul></ul>');

            jQuery.each(data.errors,function(key,val)
            {
                $('.error_message3 ul').append('<li>'+key+':'+val+'</li>');
            });
            $('.success_message3').hide();
            $('.error_message3').show();

            //reverse the response on the button
            $('button[type="button"]', $form).each(function()
            {
                $btn = $(this);
                label = $btn.prop('orig_label');
                if(label)
                {
                    $btn.prop('type','submit' );
                    $btn.text(label);
                    $btn.prop('orig_label','');
                }
            });

        }//else
    }

	$('#theform3').submit(function(e)
      {
        e.preventDefault();

        $form = $(this);
        //show some response on the button
        $('button[type="submit"]', $form).each(function()
        {
            $btn = $(this);
            $btn.prop('type','button' );
            $btn.prop('orig_label',$btn.text());
            $btn.text('Sending ...');
        });


                    $.ajax({
                type: "POST",
                url: 'handler.php',
                data: $form.serialize(),
                success: after_form_submitted,
                dataType: 'json'
            });

      });
});
